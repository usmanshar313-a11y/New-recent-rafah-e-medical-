import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  UserCheck, 
  Calendar, 
  Clock, 
  Search, 
  Award, 
  Filter,
  CheckCircle2
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { db } from '../firebase';
import { Doctor } from '../types';
import { BookingModal } from '../components/booking/BookingModal';

gsap.registerPlugin(ScrollTrigger);

const SAMPLE_DOCTORS: Doctor[] = [
  { id: 'doc-1', name: 'Dr. Ajmaal Jami', specialty: 'General Physician' },
  { id: 'doc-2', name: 'Dr. Saqib Zain', specialty: 'General Physician' },
  { id: 'doc-3', name: 'Dr. Wajid Ali', specialty: 'Consultant Cardiologist & Physician' },
  { id: 'doc-4', name: 'Dr. S. Kashif Mateen', specialty: 'Consultant General Surgeon & Laparoscopic Surgeon' },
  { id: 'doc-5', name: 'Dr. Hira', specialty: 'Child Specialist' },
  { id: 'doc-6', name: 'Dr. S.M. Hussain Hadi Naqvi', specialty: 'Child Specialist' },
  { id: 'doc-7', name: 'Dr. Saud Abdul Qayyum', specialty: 'Child Specialist' },
  { id: 'doc-8', name: 'Dr. Amir Hussain', specialty: 'Child Specialist' },
  { id: 'doc-9', name: 'Dr. Syed Habib Ahmed', specialty: 'Child Specialist' },
  { id: 'doc-10', name: 'Dr. Ghazala Naseem', specialty: 'Obstetrics & Gynaecologist' },
  { id: 'doc-11', name: 'Dr. Fauzia Ali', specialty: 'Obstetrics & Gynaecologist' },
  { id: 'doc-12', name: 'Dr. Misbah Noreen', specialty: 'Obstetrics & Gynaecologist' },
  { id: 'doc-13', name: 'Dr. Ferheen', specialty: 'Obstetrics & Gynaecologist' },
  { id: 'doc-14', name: 'Dr. Sanawar Pasha', specialty: 'Obstetrics & Gynaecologist' },
  { id: 'doc-15', name: 'Dr. Khurram Zia', specialty: 'Consultant Dental Surgeon' },
  { id: 'doc-16', name: 'Dr. Syed Saadat Ali', specialty: 'Cardiologist' },
  { id: 'doc-17', name: 'Dr. Usman Alam', specialty: 'Cardiologist' },
  { id: 'doc-18', name: 'Dr. Javeriya Qureshi', specialty: 'Sonologist & Radiologist' },
  { id: 'doc-19', name: 'Dr. Shabana Saeed', specialty: 'Sonologist & Radiologist' },
  { id: 'doc-20', name: 'Dr. Gulnaz Ismail', specialty: 'Sonologist & Radiologist' },
  { id: 'doc-21', name: 'Dr. S.M. Shahnawaz', specialty: 'Sonologist & Radiologist' },
  { 
    id: 'doc-22', 
    name: 'Dr. Erum Kazim', 
    specialty: 'General, Breast & Laparoscopic Surgeon', 
    bio: 'Assistant Professor Surgery, Dow University of Health Sciences & Civil Hospital Karachi' 
  },
  { id: 'doc-23', name: 'Dr. Mubashir Iqbal', specialty: 'General, Breast & Laparoscopic Surgeon' },
  { id: 'doc-24', name: 'Dr. Masood', specialty: 'General & Laparoscopic Surgeon' },
  { id: 'doc-25', name: 'Dr. Akhtar Baig', specialty: 'Orthopedic' },
  { id: 'doc-26', name: 'Dr. Nadia Adnan', specialty: 'General & Chest Physician' },
  { id: 'doc-27', name: 'Dr. Syed Ali Talha Raza', specialty: 'General & Chest Physician' },
  { id: 'doc-28', name: 'Dr. Shakeel Ahmed', specialty: 'Diabetologist' },
  { id: 'doc-29', name: 'Dr. Qazi Mujahid Ali', specialty: 'Diabetologist' },
  { id: 'doc-30', name: 'Dr. M. Naseem Akhter', specialty: 'Family Physician' },
  { id: 'doc-31', name: 'Dr. Suresh Kumar', specialty: 'Gastroenterologist / Hepatologist' },
  { id: 'doc-32', name: 'Dr. Bushra Rabbani', specialty: 'Consultant General Physician' },
  { id: 'doc-33', name: 'Dr. Moeen Qureshi', specialty: 'General & Dialysis Specialist' },
  { id: 'doc-34', name: 'Dr. Asif Ali Abbasi', specialty: 'ENT Specialist' },
];

export const DoctorsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [doctors, setDoctors] = useState<Doctor[]>(SAMPLE_DOCTORS);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state if URL search query changes
  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null && query !== searchTerm) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Specialties list
  const specialtyFilters = [
    'All',
    'Physician',
    'Cardiologist',
    'Surgeon',
    'Child Specialist',
    'Gynaecologist',
    'Orthopedic',
    'Radiologist',
    'Diabetologist',
    'ENT'
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchSpecialtyPill =
      selectedSpecialty === 'All' ||
      doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());

    const term = searchTerm.toLowerCase().trim();
    const matchSearch =
      !term ||
      doc.name.toLowerCase().includes(term) ||
      doc.specialty.toLowerCase().includes(term) ||
      (doc.bio && doc.bio.toLowerCase().includes(term));

    return matchSpecialtyPill && matchSearch;
  });

  // GSAP Entrance Animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.doc-hero-banner',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.doc-search-bar',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.doc-card',
        { opacity: 0, y: 25, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: 'power2.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [filteredDoctors.length, selectedSpecialty]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchDoctors = async () => {
      try {
        const snap = await getDocs(collection(db, 'doctors'));
        const fetched: Doctor[] = [];
        snap.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Doctor);
        });
        if (fetched.length > 0) {
          setDoctors(fetched);
        }
      } catch (e) {
        console.warn('Using default doctor panel list');
      }
    };
    fetchDoctors();
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  const handleOpenBooking = (docId: string) => {
    setSelectedDoctorId(docId);
    setBookingModalOpen(true);
  };

  return (
    <div ref={containerRef} className="bg-white min-h-screen py-10 text-[#1F2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div className="doc-hero-banner bg-[#22A25A] text-white p-8 rounded-3xl shadow-lg border border-[#1E834B] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <span className="bg-[#1E834B] text-[#D9691F] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Specialist Medical Panel
            </span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              Consultant & Medical Doctors
            </h1>
            <p className="text-xs sm:text-sm text-[#E8F7EE] leading-relaxed">
              Find and consult with experienced consultants, surgeons, pediatricians, cardiologists, and specialists at Rafah-E-Aam Medical Center.
            </p>
          </div>

          <div className="text-center md:text-right bg-[#1E834B]/80 p-4 rounded-2xl border border-white/20">
            <div className="text-2xl font-extrabold text-[#D9691F]">{doctors.length}+</div>
            <div className="text-xs text-[#E8F7EE] font-semibold">Authorized Specialists</div>
          </div>
        </div>

        {/* Doctor Search Bar & Specialty Filter */}
        <div className="doc-search-bar bg-white p-5 rounded-2xl shadow-2xs border border-gray-200 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-[#22A25A] absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search doctors by name or medical specialty (e.g. Cardiology, Orthopedics)..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-[#1F2937] placeholder:text-gray-400 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#22A25A]"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-3 text-xs bg-[#E8F7EE] text-[#22A25A] px-2 py-1 rounded-lg font-bold hover:bg-[#d5f0e1]"
                >
                  Clear
                </button>
              )}
            </div>

            {searchTerm && (
              <div className="text-xs font-bold bg-[#E8F7EE] text-[#22A25A] px-3 py-2 rounded-xl border border-[#22A25A]/20 whitespace-nowrap">
                Found {filteredDoctors.length} doctor{filteredDoctors.length === 1 ? '' : 's'} matching "{searchTerm}"
              </div>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-[#1F2937] mr-2 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Specialty:
            </span>
            {specialtyFilters.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSpecialty === spec
                    ? 'bg-[#22A25A] text-white shadow-2xs'
                    : 'bg-gray-50 text-[#1F2937] hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center space-y-3 border border-gray-200">
            <UserCheck className="w-12 h-12 text-[#22A25A] mx-auto" />
            <h3 className="font-heading font-bold text-lg text-[#1F2937]">No Doctors Found</h3>
            <p className="text-xs text-[#6B7280]">
              No medical specialist matched your search "{searchTerm}". Try searching for another specialty (e.g., "Cardiology", "Surgeon", "Child").
            </p>
            <button
              onClick={() => { handleSearchChange(''); setSelectedSpecialty('All'); }}
              className="bg-[#22A25A] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-[#1E834B]"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="doc-card bg-white rounded-2xl shadow-2xs hover:shadow-md transition-all border border-gray-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 bg-[#E8F7EE] relative overflow-hidden">
                    <img
                      src={doc.photoURL || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
                      alt={doc.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top"
                    />
                    {doc.roomNumber && (
                      <span className="absolute bottom-2 right-2 bg-[#22A25A] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        {doc.roomNumber}
                      </span>
                    )}
                    {doc.isAvailable === false && (
                      <span className="absolute top-2 right-2 bg-[#D9691F] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                        On Leave
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-heading font-bold text-base text-[#1F2937]">
                      {doc.name}
                    </h3>
                    <div className="text-xs font-bold text-[#D9691F] bg-[#FBEAE0] px-2 py-0.5 rounded-md inline-block">
                      {doc.specialty}
                    </div>

                    {doc.bio && (
                      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs text-[#6B7280] leading-relaxed break-words mt-1">
                        {doc.bio}
                      </div>
                    )}

                    {doc.availableDays && (Array.isArray(doc.availableDays) ? doc.availableDays.length > 0 : Boolean(doc.availableDays)) && (
                      <div className="flex items-center gap-2 text-xs text-[#6B7280] font-medium pt-1.5 min-w-0">
                        <Calendar className="w-4 h-4 text-[#22A25A] shrink-0" />
                        <span className="truncate">Days: {Array.isArray(doc.availableDays) ? doc.availableDays.join(', ') : doc.availableDays}</span>
                      </div>
                    )}

                    {doc.timing && (
                      <div className="flex items-center gap-2 text-xs text-[#6B7280] font-medium pt-0.5 min-w-0">
                        <Clock className="w-4 h-4 text-[#22A25A] shrink-0" />
                        <span className="truncate">Timing: {doc.timing}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 mt-2">
                  {doc.isAvailable !== false ? (
                    <button
                      onClick={() => handleOpenBooking(doc.id)}
                      className="w-full bg-[#22A25A] hover:bg-[#1E834B] text-white py-2.5 rounded-xl text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Visit with Doctor</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-[#FBEAE0] text-[#D9691F] border border-[#D9691F]/30 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed opacity-80"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Currently On Leave</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedDoctorId={selectedDoctorId}
      />
    </div>
  );
};
