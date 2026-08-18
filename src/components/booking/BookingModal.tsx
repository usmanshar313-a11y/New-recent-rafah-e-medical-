import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Stethoscope, 
  CheckCircle2, 
  MessageSquare,
  Lock,
  AlertTriangle,
  LogIn,
  MapPin
} from 'lucide-react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { Doctor, Service } from '../../types';
import { ALL_DOCTORS, DEFAULT_SERVICES } from '../../data/departmentsData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctorId?: string;
  preselectedServiceId?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedDoctorId,
  preselectedServiceId,
}) => {
  const navigate = useNavigate();
  const { user, patientProfile } = useAuth();

  const [doctors, setDoctors] = useState<Doctor[]>(ALL_DOCTORS);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [service, setService] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [reason, setReason] = useState('');
  const [isReturning, setIsReturning] = useState(false);

  // Security & Mandatory Checkbox states
  const [confirmedDetails, setConfirmedDetails] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const phoneFormatRegex = /^03\d{9}$/;
  const isPhoneValid = phoneFormatRegex.test(phone.trim());

  // Prefill when opened
  useEffect(() => {
    if (isOpen) {
      if (patientProfile) {
        setName(patientProfile.name || '');
        setPhone((patientProfile.phone || '').replace(/\D/g, '').slice(0, 11));
        setEmail(patientProfile.email || '');
      } else if (user) {
        setName(user.displayName || '');
        setEmail(user.email || '');
      }

      // Default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setPreferredDate(tomorrow.toISOString().split('T')[0]);

      setConfirmedDetails(false);

      const targetDocId = preselectedDoctorId || '';
      setDoctorId(targetDocId);

      // Auto-determine department / service if doctor is selected
      const allAvailableDocs = doctors.length > 0 ? doctors : ALL_DOCTORS;
      const matchedDoc = allAvailableDocs.find((d) => d.id === targetDocId) || ALL_DOCTORS.find((d) => d.id === targetDocId);

      let targetServiceId = preselectedServiceId || '';
      if (!targetServiceId && matchedDoc) {
        const servList = services.length > 0 ? services : DEFAULT_SERVICES;
        const matchingServ = servList.find((s) => {
          if (matchedDoc.departmentId && s.id === matchedDoc.departmentId) return true;
          if (matchedDoc.departmentId && s.department === matchedDoc.departmentId) return true;
          const sName = s.name.toLowerCase();
          const dSpec = (matchedDoc.specialty || '').toLowerCase();
          return sName.includes(dSpec) || dSpec.includes(sName);
        });

        if (matchingServ) {
          targetServiceId = matchingServ.id;
        } else if (matchedDoc.departmentId) {
          targetServiceId = matchedDoc.departmentId;
        }
      }

      setService(targetServiceId);
      fetchMetadata();
    } else {
      setSubmitted(false);
      setErrorMsg('');
      setConfirmedDetails(false);
      setDoctorId('');
      setService('');
    }
  }, [isOpen, user, patientProfile, preselectedDoctorId, preselectedServiceId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const fetchMetadata = async () => {
    try {
      // Doctors
      const docSnap = await getDocs(collection(db, 'doctors'));
      const fetchedDocs: Doctor[] = [];
      docSnap.forEach((d) => fetchedDocs.push({ id: d.id, ...d.data() } as Doctor));
      if (fetchedDocs.length > 0) {
        const mergedDocs = fetchedDocs.map((fd) => {
          const fallbackDoc = ALL_DOCTORS.find((d) => d.id === fd.id);
          return {
            ...fallbackDoc,
            ...fd,
            photoURL: fd.photoURL || fallbackDoc?.photoURL,
          };
        });
        setDoctors(mergedDocs);
      }

      // Services
      const servSnap = await getDocs(collection(db, 'services'));
      const fetchedServs: Service[] = [];
      servSnap.forEach((s) => fetchedServs.push({ id: s.id, ...s.data() } as Service));
      if (fetchedServs.length > 0) setServices(fetchedServs);
    } catch (e) {
      console.warn('Using default services list', e);
    }
  };

  if (!isOpen) return null;

  // Handle mandatory confirmation checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setConfirmedDetails(true);
      setErrorMsg('');
    } else {
      setConfirmedDetails(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Login Requirement Check
    if (!user) {
      setErrorMsg('Authentication Required: You must log in first before booking an appointment.');
      return;
    }

    // 2. Mandatory Confirmation Checkbox
    if (!confirmedDetails) {
      setErrorMsg('Please confirm the details checkbox ("I confirm my details are correct") before booking.');
      return;
    }

    if (!name || !phone || !preferredDate || (!service && !doctorId)) {
      setErrorMsg('Please fill in all required fields (Name, Phone, Date, and Service/Doctor).');
      return;
    }

    if (!isPhoneValid) {
      setErrorMsg('Enter a valid 11-digit mobile number starting with 03.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const selectedDoc = doctors.find((d) => d.id === doctorId);
      const selectedServ = services.find((s) => s.id === service)?.name || service || 'General OPD';

      const patientUid = auth.currentUser?.uid || user.uid;

      const appointmentData = {
        patientId: patientUid,
        patientName: name,
        phone,
        email,
        address,
        gender,
        service: selectedServ,
        doctorId: doctorId || '',
        doctorName: selectedDoc ? selectedDoc.name : 'Duty Specialist',
        preferredDate,
        reason,
        status: 'pending',
        isReturning,
        source: 'web',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'appointments'), appointmentData);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setErrorMsg('Failed to record appointment. Please check your connection or try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getFilteredDoctors = () => {
    const availableDocs = doctors.filter((d) => d.isAvailable !== false);
    if (!service) return availableDocs;
    const selectedServObj = services.find((s) => s.id === service || s.name === service);
    const selectedName = (selectedServObj ? selectedServObj.name : service).toLowerCase();

    const filtered = availableDocs.filter((d) => {
      const spec = (d.specialty || '').toLowerCase();
      if (selectedName.includes('general physician')) {
        return spec.includes('general physician') || spec.includes('family physician') || spec.includes('physician');
      }
      if (selectedName.includes('orthopedic')) {
        return spec.includes('orthopedic');
      }
      if (selectedName.includes('cardiology')) {
        return spec.includes('cardiologist') || spec.includes('cardio');
      }
      if (selectedName.includes('pediatrics') || selectedName.includes('child')) {
        return spec.includes('child specialist') || spec.includes('pediatric');
      }
      if (selectedName.includes('obstetrics') || selectedName.includes('gynaecology')) {
        return spec.includes('obstetrics') || spec.includes('gynaecologist');
      }
      if (selectedName.includes('radiology') || selectedName.includes('sonology')) {
        return spec.includes('sonologist') || spec.includes('radiologist');
      }
      if (selectedName.includes('breast') && selectedName.includes('laparoscopic')) {
        return spec.includes('breast') || spec.includes('laparoscopic');
      }
      if (selectedName.includes('laparoscopic') || selectedName.includes('surgery')) {
        return spec.includes('surgeon') || spec.includes('surgery') || spec.includes('laparoscopic');
      }
      if (selectedName.includes('chest') || selectedName.includes('pulmonology')) {
        return spec.includes('chest') || spec.includes('pulm');
      }
      if (selectedName.includes('diabetology')) {
        return spec.includes('diabetologist') || spec.includes('diabetes');
      }
      if (selectedName.includes('family medicine')) {
        return spec.includes('family physician') || spec.includes('general physician');
      }
      if (selectedName.includes('gastroenterology') || selectedName.includes('hepatology')) {
        return spec.includes('gastroenterologist') || spec.includes('hepatologist');
      }
      if (selectedName.includes('dialysis')) {
        return spec.includes('dialysis');
      }
      if (selectedName.includes('ent')) {
        return spec.includes('ent');
      }
      if (selectedName.includes('dental')) {
        return spec.includes('dental');
      }
      return spec.includes(selectedName) || selectedName.includes(spec);
    });

    return filtered.length > 0 ? filtered : availableDocs;
  };

  const filteredDoctors = getFilteredDoctors();

  const whatsappLink = `https://wa.me/922136342011?text=${encodeURIComponent(
    `Hello Rafah-E-Aam Medical Centre, I booked an appointment request on your website for ${name} (${phone}) on ${preferredDate}. Please confirm my slot.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      
      {/* Container */}
      <div className="bg-white text-[#182334] w-full max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-[#E4E9E5]">
        
        {/* Modal Header */}
        <div className="bg-[#22A25A] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-white" />
            <h2 className="font-heading font-bold text-base sm:text-lg">
              Book Appointment — Rafah-E-Aam
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-[#168A4A] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-[#EFF4EC] text-[#22A25A] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-[#22A25A]" />
              </div>

              <h3 className="font-heading text-xl font-bold text-[#182334]">
                Appointment Request Received!
              </h3>

              <p className="text-sm text-[#5F6875] max-w-md mx-auto leading-relaxed">
                Thank you <span className="font-semibold text-[#182334]">{name}</span>. Your request for{' '}
                <span className="font-semibold text-[#182334]">{preferredDate}</span> has been logged. Our reception team will call you at <span className="font-semibold text-[#182334]">{phone}</span> to confirm.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-5 py-3 rounded-xl shadow flex items-center justify-center gap-2 text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  Confirm via WhatsApp
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto bg-[#22A25A] hover:bg-[#168A4A] text-white font-bold px-5 py-3 rounded-xl text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Doctor Profile Confirmation Header (Displayed when a doctor is selected) */}
              {(() => {
                const activeDoc = doctors.find((d) => d.id === doctorId);
                if (!activeDoc) return null;
                return (
                  <div className="bg-[#EFF4EC] p-4 rounded-2xl border border-[#E4E9E5] text-center space-y-2 mb-2 shadow-2xs">
                    <div className="relative inline-block">
                      <img
                        src={activeDoc.photoURL || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
                        alt={activeDoc.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover object-top border-4 border-white shadow-md mx-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <span className="absolute bottom-1 right-1 bg-[#22A25A] text-white p-1 rounded-full shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold text-[#168A4A] uppercase tracking-wider">Appointment Selected With</div>
                      <h4 className="font-heading font-extrabold text-lg sm:text-xl text-[#182334]">{activeDoc.name}</h4>
                      <span className="text-xs sm:text-sm font-bold text-[#168A4A] bg-white border border-[#E4E9E5] px-2.5 py-0.5 rounded-md inline-block mt-1">
                        {activeDoc.specialty}
                      </span>
                      {activeDoc.roomNumber && (
                        <div className="text-xs text-[#5F6875] font-semibold mt-1">
                          Location: <span className="font-bold text-[#182334]">{activeDoc.roomNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Login Requirement Banner */}
              {!user ? (
                <div className="bg-[#EFF4EC] border border-[#E4E9E5] p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-[#182334] font-bold text-sm">
                    <Lock className="w-4 h-4 text-[#F28C45]" />
                    <span>Authentication Required to Book</span>
                  </div>
                  <p className="text-xs text-[#5F6875] leading-relaxed">
                    Appointment booking is restricted to authenticated patients. Please log in or create a patient account to confirm your slot.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/portal');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full bg-[#22A25A] hover:bg-[#168A4A] text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log In / Sign Up to Continue</span>
                  </button>
                </div>
              ) : (
                <div className="bg-[#EFF4EC] p-3 rounded-xl border border-[#E4E9E5] text-xs text-[#182334] flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#22A25A]" /> Logged in as: {patientProfile?.name || user.displayName || user.email}
                  </span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-xs sm:text-sm rounded-xl font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Patient Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#182334] mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#22A25A] absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Muhammad Ali"
                      className="w-full bg-white border border-[#E4E9E5] rounded-xl pl-10 pr-3.5 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#22A25A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#182334] mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#22A25A] absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      required
                      maxLength={11}
                      value={phone}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 11);
                        setPhone(digitsOnly);
                        if (errorMsg && (errorMsg.includes('mobile number') || errorMsg.includes('phone'))) {
                          setErrorMsg('');
                        }
                      }}
                      placeholder="03XXXXXXXXX"
                      className="w-full bg-white border border-[#E4E9E5] rounded-xl pl-10 pr-3.5 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#22A25A]"
                    />
                  </div>
                  <p className={`mt-2 text-xs ${!phone || isPhoneValid ? 'text-[#5F6875]' : 'text-red-700'}`}>
                    Enter a valid 11-digit mobile number starting with 03.
                  </p>
                </div>
              </div>

              {/* Email & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#182334] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#22A25A] absolute left-3 top-3.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full bg-white border border-[#E4E9E5] rounded-xl pl-10 pr-3.5 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#22A25A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#182334] mb-1.5">
                    Gender *
                  </label>
                  <div className="flex items-center gap-6 bg-white p-2.5 sm:p-3 rounded-xl border border-[#E4E9E5] text-sm font-semibold">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={gender === 'Male'}
                        onChange={() => setGender('Male')}
                        className="w-4 h-4 accent-[#22A25A] cursor-pointer"
                      />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={gender === 'Female'}
                        onChange={() => setGender('Female')}
                        className="w-4 h-4 accent-[#22A25A] cursor-pointer"
                      />
                      <span>Female</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#182334] mb-1.5">
                  Residential Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#22A25A] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. House #123, Block 13, Gulberg Town, Karachi"
                    className="w-full bg-white border border-[#E4E9E5] rounded-xl pl-10 pr-3.5 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#22A25A]"
                  />
                </div>
              </div>

              {/* Service / Department */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#182334] mb-1.5">
                  Select Department / Care *
                </label>
                <div className="relative">
                  <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-[#22A25A] absolute left-3 top-3.5" />
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-white border border-[#E4E9E5] rounded-xl pl-10 pr-3.5 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#22A25A]"
                  >
                    <option value="">-- Choose Department / Care --</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preferred Doctor & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#182334] mb-1.5">
                    Select Doctor (Optional)
                  </label>
                  <select
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="w-full bg-white border border-[#E4E9E5] rounded-xl px-3.5 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#22A25A]"
                  >
                    <option value="">-- Any Available Specialist ({filteredDoctors.length} available) --</option>
                    {filteredDoctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#182334] mb-1.5">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-white border border-[#E4E9E5] rounded-xl px-3.5 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#22A25A]"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-[#182334] mb-1">
                  Reason for Visit / Symptoms
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly describe symptoms or checkup type..."
                  className="w-full bg-white border border-[#E4E9E5] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22A25A]"
                />
              </div>

              {/* Mandatory Confirmation Checkbox */}
              <div className="p-3 bg-[#EFF4EC] rounded-xl border border-[#E4E9E5] flex items-start gap-3">
                <input
                  type="checkbox"
                  id="confirmDetailsCheckbox"
                  checked={confirmedDetails}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 mt-0.5 accent-[#22A25A] rounded cursor-pointer shrink-0"
                />
                <label htmlFor="confirmDetailsCheckbox" className="text-xs text-[#182334] font-medium cursor-pointer">
                  I confirm my details (Phone/WhatsApp number & email) are correct.
                </label>
              </div>

              {/* Submit CTA - Disabled when not logged in or checkbox unchecked */}
              <button
                type="submit"
                disabled={submitting || !user || !confirmedDetails || !isPhoneValid}
                className="w-full bg-[#22A25A] hover:bg-[#168A4A] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? (
                  <span>Submitting Request...</span>
                ) : !user ? (
                  <span>Log In Required to Submit</span>
                ) : !confirmedDetails ? (
                  <span>Please Confirm Checkbox Above</span>
                ) : !isPhoneValid ? (
                  <span>Put the correct phone number</span>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 text-white" />
                    <span>Confirm Appointment</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
