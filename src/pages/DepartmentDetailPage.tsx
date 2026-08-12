import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Banknote, 
  UserCheck, 
  Loader2,
  Info,
  X,
  Sparkles
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { db } from '../firebase';
import { DEPARTMENTS_DATA } from '../data/departmentsData';
import { Department, Doctor } from '../types';
import { DepartmentIcon } from '../components/common/DepartmentIcon';

gsap.registerPlugin(ScrollTrigger);

// In-Memory Doctor Cache to prevent redundant Firestore network reads
const departmentDoctorCache: Record<string, Doctor[]> = {};

export const DepartmentDetailPage: React.FC = () => {
  const { departmentId } = useParams<{ departmentId: string }>();

  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<Doctor | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const loadDepartmentData = async () => {
      const targetId = (departmentId || '').toLowerCase();
      
      // Find initial matching department from local static dataset
      const localDept = DEPARTMENTS_DATA.find(
        (d) => d.id.toLowerCase() === targetId
      );

      if (!localDept) {
        setDepartment(null);
        setLoading(false);
        return;
      }

      let currentDept = { ...localDept };

      // 1. Check in-memory cache first for instant render
      if (departmentDoctorCache[targetId]) {
        setDepartment({
          ...currentDept,
          doctors: departmentDoctorCache[targetId],
        });
        setLoading(false);
        return;
      }

      // 2. Lazy load doctor data from Firestore if not cached (with fallback timeout)
      setLoading(true);
      try {
        const fetchPromise = getDocs(collection(db, 'doctors'));
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Firestore fetch timeout')), 2000)
        );

        const docSnap = await Promise.race([fetchPromise, timeoutPromise]);
        const fetchedDocs: Doctor[] = [];
        docSnap.forEach((d) => fetchedDocs.push({ id: d.id, ...d.data() } as Doctor));

        if (fetchedDocs.length > 0) {
          const matchedDocs = fetchedDocs.filter((fd) => {
            const spec = (fd.specialty || '').toLowerCase();
            const deptName = currentDept.name.toLowerCase();
            if (deptName.includes('general opd') && (spec.includes('general physician') || spec.includes('physician'))) return true;
            if (deptName.includes('cardiology') && spec.includes('cardio')) return true;
            if (deptName.includes('orthopedics') && spec.includes('ortho')) return true;
            if (deptName.includes('pediatrics') && (spec.includes('child') || spec.includes('pediatric'))) return true;
            if (deptName.includes('obstetrics') && (spec.includes('gynaec') || spec.includes('obstetric'))) return true;
            if (deptName.includes('radiology') && (spec.includes('sonologist') || spec.includes('radiologist'))) return true;
            if (deptName.includes('surgical') && (spec.includes('surgeon') || spec.includes('surgery'))) return true;
            if (deptName.includes('diabetology') && spec.includes('diabet')) return true;
            if (deptName.includes('chest') && (spec.includes('chest') || spec.includes('pulm'))) return true;
            if (deptName.includes('gastro') && spec.includes('gastro')) return true;
            if (deptName.includes('dialysis') && spec.includes('dialysis')) return true;
            if (deptName.includes('ent') && spec.includes('ent')) return true;
            if (deptName.includes('dental') && spec.includes('dental')) return true;
            return false;
          });

          if (matchedDocs.length > 0) {
            departmentDoctorCache[targetId] = matchedDocs;
            currentDept = {
              ...currentDept,
              doctors: matchedDocs,
            };
          } else {
            departmentDoctorCache[targetId] = currentDept.doctors;
          }
        } else {
          departmentDoctorCache[targetId] = currentDept.doctors;
        }
      } catch {
        // Silent fallback to local static data
        departmentDoctorCache[targetId] = currentDept.doctors;
      } finally {
        setDepartment(currentDept);
        setLoading(false);
      }
    };

    loadDepartmentData();
  }, [departmentId]);

  // GSAP Entrance Scroll Animation for Department Detail page elements
  useEffect(() => {
    if (!department || loading) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Animate Header & Navigation elements
      gsap.fromTo(
        '.gsap-header',
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      );

      // 2. Animate Section Title
      gsap.fromTo(
        '.gsap-section-title',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.gsap-section-title',
            start: 'top 92%',
            once: true,
          },
        }
      );

      // 3. Stagger animate Doctor Cards
      const cards = containerRef.current?.querySelectorAll('.doc-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 35, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cards[0],
              start: 'top 88%',
              once: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [department, loading]);

  const handleOpenBooking = (docId: string) => {
    window.dispatchEvent(
      new CustomEvent('open-booking-modal', {
        detail: { doctorId: docId, departmentId: department?.id },
      })
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-[#22A25A]">
        <div className="text-center space-y-4">
          <Loader2 className="w-9 h-9 text-[#22A25A] animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#22A25A]">Loading Department Specialists...</p>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-white py-16 px-4 text-[#22A25A]">
        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-3xl text-center space-y-6 shadow-2xs border border-gray-200">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2937]">Department Not Found</h2>
          <p className="text-xs sm:text-sm text-[#6B7280] font-medium">
            The requested medical department could not be located in our OPD directory.
          </p>
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#22A25A] text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-[#1E834B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Departments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-white min-h-screen py-6 sm:py-8 text-[#1F2937]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Navigation & Header Section */}
        <div className="space-y-4">
          {/* ← Back to Departments link */}
          <div className="gsap-header">
            <Link
              to="/departments"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#22A25A] hover:text-[#1E834B] bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs transition-all hover:-translate-x-0.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Departments
            </Link>
          </div>

          {/* Department Header */}
          <div className="gsap-header bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 bg-[#E8F7EE] rounded-xl border border-[#22A25A]/20 shrink-0 text-[#22A25A]">
              <DepartmentIcon iconType={department.icon} className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1F2937] leading-tight">
                {department.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#6B7280] font-medium mt-1 line-clamp-2">
                {department.description}
              </p>
            </div>
          </div>
        </div>

        {/* Section Indicator */}
        <div className="gsap-section-title flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1F2937]">
            <UserCheck className="w-4.5 h-4.5 text-[#22A25A]" />
            <span>Consulting Specialists ({department.doctors.length})</span>
          </div>
        </div>

        {/* Doctor Cards Grid */}
        {department.doctors.length === 0 ? (
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 text-center space-y-3">
            <p className="text-sm text-[#6B7280] font-medium">
              No individual consultant listed online for this department at the moment.
            </p>
            <p className="text-xs text-[#6B7280]/70">
              Walk-in OPD consultations and emergency support are available at reception 24/7.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {department.doctors.map((doc) => (
              <div
                key={doc.id}
                className="doc-card bg-white rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition-all p-6 sm:p-7 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Photo, Name, Specialty, Room */}
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        doc.photoURL ||
                        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={doc.name}
                      className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl object-cover object-top border border-gray-200 bg-gray-50 shrink-0 shadow-2xs"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#1F2937] leading-tight truncate">
                        {doc.name}
                      </h3>
                      <p className="text-xs font-bold text-[#D9691F] mt-1 truncate">
                        {doc.specialty}
                      </p>
                      {doc.roomNumber && (
                        <p className="text-xs text-[#6B7280] font-medium mt-1.5 flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#22A25A] shrink-0" />
                          <span className="truncate">OPD Room: {doc.roomNumber}</span>
                        </p>
                      )}

                      {doc.isAvailable === false && (
                        <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#FBEAE0] text-[#D9691F] border border-[#D9691F]/30">
                          <span className="w-2 h-2 rounded-full bg-[#D9691F]" />
                          <span>Currently Unavailable (On Leave)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Schedule & Fee Info */}
                  <div className="space-y-2 pt-3 border-t border-gray-100 text-xs text-[#6B7280]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 font-medium shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-[#22A25A]" /> Days:
                      </span>
                      <span className="font-bold text-[#1F2937] truncate text-right">
                        {Array.isArray(doc.availableDays)
                          ? doc.availableDays.join(', ')
                          : doc.availableDays || department.days || 'Mon - Sat'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 font-medium shrink-0">
                        <Clock className="w-3.5 h-3.5 text-[#22A25A]" /> Timing:
                      </span>
                      <span className="font-bold text-[#1F2937] truncate text-right">
                        {doc.timing || department.timing || '09:00 AM - 05:00 PM'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 font-medium shrink-0">
                        <Banknote className="w-3.5 h-3.5 text-[#22A25A]" /> Fee:
                      </span>
                      <span className="font-extrabold text-[#D9691F] text-xs bg-[#FBEAE0] border border-[#D9691F]/20 px-2.5 py-0.5 rounded-md">
                        {doc.fee || department.fee || 'Rs. 1,000'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedDoctorForModal(doc)}
                    className="flex-1 border border-gray-200 hover:bg-[#E8F7EE] text-[#22A25A] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>View Detail</span>
                  </button>

                  {doc.isAvailable !== false ? (
                    <button
                      onClick={() => handleOpenBooking(doc.id)}
                      className="flex-1 bg-[#22A25A] hover:bg-[#1E834B] active:bg-[#186A3B] text-white py-2.5 px-3 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Appointment</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 bg-[#FBEAE0] text-[#D9691F] border border-[#D9691F]/30 py-2.5 px-3 rounded-xl text-xs font-bold opacity-80 cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>On Leave</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Doctor Detail Modal */}
      {selectedDoctorForModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setSelectedDoctorForModal(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#22A25A]">
                <Sparkles className="w-4 h-4 text-[#D9691F]" />
                <span>Doctor Details</span>
              </div>
              <button
                onClick={() => setSelectedDoctorForModal(null)}
                className="p-1.5 rounded-full hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              <div className="flex items-start gap-4">
                <img
                  src={
                    selectedDoctorForModal.photoURL ||
                    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={selectedDoctorForModal.name}
                  className="w-20 h-20 rounded-xl object-cover object-top border border-gray-200 bg-gray-50 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-extrabold text-lg text-[#1F2937]">
                    {selectedDoctorForModal.name}
                  </h3>
                  <p className="text-xs font-bold text-[#D9691F] mt-1">
                    {selectedDoctorForModal.specialty}
                  </p>
                  {selectedDoctorForModal.roomNumber && (
                    <p className="text-xs text-[#6B7280] font-medium mt-1">
                      OPD Location: {selectedDoctorForModal.roomNumber}
                    </p>
                  )}
                </div>
              </div>

              {selectedDoctorForModal.bio && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[#22A25A] uppercase tracking-wider">Biography & Experience</h4>
                  <p className="text-xs text-[#6B7280] leading-relaxed font-medium bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {selectedDoctorForModal.bio}
                  </p>
                </div>
              )}

              <div className="space-y-2 pt-2 text-xs text-[#6B7280] border-t border-gray-100">
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium">Consultation Days:</span>
                  <span className="font-bold text-[#1F2937]">
                    {Array.isArray(selectedDoctorForModal.availableDays)
                      ? selectedDoctorForModal.availableDays.join(', ')
                      : selectedDoctorForModal.availableDays || department.days || 'Mon - Sat'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium">Consultation Hours:</span>
                  <span className="font-bold text-[#1F2937]">
                    {selectedDoctorForModal.timing || department.timing || '09:00 AM - 05:00 PM'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium">Consultation Fee:</span>
                  <span className="font-extrabold text-[#D9691F]">
                    {selectedDoctorForModal.fee || department.fee || 'Rs. 1,000'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedDoctorForModal(null)}
                className="px-4 py-2 text-xs font-bold text-[#1F2937] hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const docId = selectedDoctorForModal.id;
                  setSelectedDoctorForModal(null);
                  handleOpenBooking(docId);
                }}
                className="px-5 py-2.5 bg-[#22A25A] text-white text-xs font-bold rounded-xl hover:bg-[#1E834B] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
