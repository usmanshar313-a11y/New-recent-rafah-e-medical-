import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  Clock, 
  Banknote, 
  UserCheck, 
  Filter, 
  Sparkles,
  ArrowRight,
  X,
  Check,
  RotateCcw
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Department } from '../types';
import { DEPARTMENTS_DATA } from '../data/departmentsData';
import { DepartmentIcon, getDepartmentTheme } from '../components/common/DepartmentIcon';

export { DEPARTMENTS_DATA };

gsap.registerPlugin(ScrollTrigger);

export const DepartmentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [departments] = useState<Department[]>(DEPARTMENTS_DATA);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('All');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync search input with URL search param
  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ search: searchTerm }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [searchTerm, setSearchParams]);

  // GSAP Entrance animation for department cards & hero elements
  useEffect(() => {
    window.scrollTo(0, 0);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dept-hero-content',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.dept-search-bar',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: 'power2.out' }
      );

      gsap.utils.toArray<HTMLDivElement>('.dept-card').forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 35, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none',
              markers: false,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [selectedDeptId, searchTerm]);

  // Filter departments based on selected department filter or search term
  const filteredDepartments = departments.filter((dept) => {
    // 1. Department Filter
    const matchesDept = selectedDeptId === 'All' || dept.id === selectedDeptId;
    if (!matchesDept) return false;

    // 2. Search Bar
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    const matchesDeptName = dept.name.toLowerCase().includes(term);
    const matchesDeptDesc = dept.description.toLowerCase().includes(term);
    const matchesDoctor = dept.doctors.some(
      (doc) =>
        doc.name.toLowerCase().includes(term) ||
        doc.specialty.toLowerCase().includes(term)
    );

    return matchesDeptName || matchesDeptDesc || matchesDoctor;
  });

  const selectedDepartmentObj = departments.find((d) => d.id === selectedDeptId);

  // Modal Department List filtered by internal search
  const modalDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(modalSearchTerm.toLowerCase())
  );

  return (
    <div ref={containerRef} className="bg-white min-h-screen py-8 sm:py-10 text-[#1F2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

        {/* Hero Banner Section */}
        <div className="dept-hero-content bg-[#22A25A] text-white rounded-3xl p-7 sm:p-12 shadow-xs relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="max-w-3xl space-y-3 sm:space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E834B] border border-white/20 text-xs font-extrabold uppercase tracking-wider text-white">
              <Sparkles className="w-4 h-4 text-[#D9691F]" />
              <span>Rafah-e-Aam Medical Centre OPD</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-5xl tracking-tight leading-tight text-white">
              Medical Departments & Specialists
            </h1>
            <p className="text-xs sm:text-base text-[#E8F7EE] font-medium leading-relaxed max-w-2xl">
              Select a specialized medical department below to view consulting doctors, OPD schedules, room locations, and book your visit directly.
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="dept-search-bar bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          
          {/* Text Search Input */}
          <div className="relative flex-1">
            <Search className="w-4.5 h-4.5 text-[#22A25A] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search department, doctor, or specialty..."
              className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-[#1F2937] placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#22A25A] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#22A25A] hover:text-[#1E834B] bg-[#E8F7EE] px-2 py-1 rounded-md cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Department Filter Dropdown/Popup Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                selectedDeptId !== 'All'
                  ? 'bg-[#1E834B] text-white border-[#1E834B] shadow-2xs'
                  : 'bg-gray-50 text-[#1F2937] border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Filter className="w-4 h-4 shrink-0" />
              <span className="truncate max-w-[180px] sm:max-w-[220px]">
                {selectedDeptId === 'All'
                  ? 'Filter by Department'
                  : `Dept: ${selectedDepartmentObj?.name || selectedDeptId}`}
              </span>
              {selectedDeptId !== 'All' && (
                <span className="bg-[#D9691F] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                  1
                </span>
              )}
            </button>

            {selectedDeptId !== 'All' && (
              <button
                onClick={() => setSelectedDeptId('All')}
                title="Reset Department Filter"
                className="p-3 rounded-xl bg-[#FBEAE0] text-[#D9691F] border border-[#D9691F]/30 hover:bg-[#f7ded0] transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results Counter & Active Filter Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-bold text-[#6B7280] px-1">
          <div className="flex items-center gap-2">
            <span>Showing {filteredDepartments.length} Department{filteredDepartments.length === 1 ? '' : 's'}</span>
            {selectedDeptId !== 'All' && selectedDepartmentObj && (
              <span className="bg-[#E8F7EE] text-[#22A25A] px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 border border-[#22A25A]/20">
                <span>{selectedDepartmentObj.name}</span>
                <button
                  onClick={() => setSelectedDeptId('All')}
                  className="hover:text-red-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>
          {searchTerm && (
            <span className="text-[#22A25A]">
              Search query: "{searchTerm}"
            </span>
          )}
        </div>

        {/* Department Cards List */}
        {filteredDepartments.length === 0 ? (
          <div className="bg-white p-10 sm:p-12 rounded-3xl border border-gray-200 text-center space-y-4">
            <p className="text-base font-bold text-[#22A25A]">No matching medical departments found</p>
            <p className="text-xs text-[#6B7280]">Try adjusting your search text or department filter selection.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDeptId('All');
              }}
              className="px-5 py-2.5 bg-[#22A25A] text-white text-xs font-bold rounded-xl hover:bg-[#1E834B] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:gap-7">
            {filteredDepartments.map((dept) => {
              const theme = getDepartmentTheme(dept.id);

              return (
                <div
                  key={dept.id}
                  className="dept-card bg-white rounded-3xl border border-gray-200 shadow-2xs hover:shadow-md hover:border-[#22A25A]/40 transition-all flex flex-col lg:flex-row overflow-hidden group"
                >
                  {/* Left / Upper Block: Tinted Header Zone */}
                  <div className={`p-6 sm:p-7 ${theme.bgTint} border-b lg:border-b-0 lg:border-r ${theme.borderTint} flex flex-col justify-between space-y-4 shrink-0 lg:w-[300px] xl:w-[340px]`}>
                    <div className="flex items-start gap-4">
                      {/* Department Icon */}
                      <div className={`p-3.5 bg-white rounded-2xl border ${theme.borderTint} shadow-2xs shrink-0 ${theme.iconColor}`}>
                        <DepartmentIcon iconType={dept.icon} deptId={dept.id} className="w-7 h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[#1F2937] leading-snug group-hover:text-[#22A25A] transition-colors">
                          {dept.name}
                        </h2>
                        <div className={`mt-2 inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border border-black/5 ${theme.badgeBg} ${theme.badgeText}`}>
                          <UserCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>{dept.doctors.length} Specialist{dept.doctors.length === 1 ? '' : 's'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Block: Description Text */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-center space-y-2">
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#22A25A] hidden lg:block">
                      Department Overview
                    </h4>
                    <p className="text-xs sm:text-sm text-[#6B7280] font-medium leading-relaxed">
                      {dept.description}
                    </p>
                  </div>

                  {/* Right / Schedule Block: Days, Timings, Fee & Show Doctors CTA */}
                  <div className="p-6 sm:p-7 bg-gray-50/60 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col justify-between space-y-5 lg:w-[290px] xl:w-[310px] shrink-0">
                    <div className="space-y-2.5 text-xs text-[#1F2937]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium text-[#6B7280]">
                          <Calendar className="w-3.5 h-3.5 text-[#22A25A]" /> Days:
                        </span>
                        <span className="font-bold text-[#1F2937]">{dept.days || 'Mon - Sat'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium text-[#6B7280]">
                          <Clock className="w-3.5 h-3.5 text-[#22A25A]" /> Timing:
                        </span>
                        <span className="font-bold text-[#1F2937]">{dept.timing || '09:00 AM - 05:00 PM'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium text-[#6B7280]">
                          <Banknote className="w-3.5 h-3.5 text-[#22A25A]" /> Fee:
                        </span>
                        <span className="font-extrabold text-[#D9691F] bg-[#FBEAE0] px-2.5 py-1 rounded-full border border-[#D9691F]/20">{dept.fee || 'Rs. 1,000'}</span>
                      </div>
                    </div>

                    {/* Primary Dedicated CTA Button */}
                    <Link
                      to={`/departments/${dept.id}`}
                      className="w-full bg-[#22A25A] hover:bg-[#1E834B] active:bg-[#186A3B] text-white py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer group/btn"
                    >
                      <span>Show Doctors</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Department Selection Filter Modal / Bottom Sheet */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in">
          <div
            className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#1F2937]">
                  Filter by Department
                </h3>
                <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                  Select a medical specialty to narrow down departments
                </p>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Quick Search */}
            <div className="p-4 border-b border-gray-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-[#22A25A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                  placeholder="Type to filter departments list..."
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#1F2937] focus:outline-hidden focus:ring-2 focus:ring-[#22A25A]"
                />
              </div>
            </div>

            {/* Department List Options */}
            <div className="p-3 sm:p-4 overflow-y-auto space-y-1.5 flex-1 divide-y divide-gray-100">
              {/* All Departments Option */}
              <button
                onClick={() => {
                  setSelectedDeptId('All');
                  setIsFilterModalOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedDeptId === 'All'
                    ? 'bg-[#22A25A] text-white'
                    : 'hover:bg-[#E8F7EE] text-[#1F2937]'
                }`}
              >
                <span>All Departments ({departments.length})</span>
                {selectedDeptId === 'All' && <Check className="w-4 h-4 text-[#D9691F]" />}
              </button>

              {/* Specific Department Options */}
              {modalDepartments.map((dept) => {
                const isSelected = selectedDeptId === dept.id;
                const theme = getDepartmentTheme(dept.id);
                return (
                  <button
                    key={dept.id}
                    onClick={() => {
                      setSelectedDeptId(dept.id);
                      setIsFilterModalOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#22A25A] text-white'
                        : 'hover:bg-[#E8F7EE] text-[#1F2937]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-1.5 rounded-lg border shrink-0 ${isSelected ? 'bg-white/20 text-white border-transparent' : `${theme.bgTint} ${theme.iconColor} ${theme.borderTint}`}`}>
                        <DepartmentIcon iconType={dept.icon} deptId={dept.id} className="w-4 h-4" />
                      </div>
                      <span className="truncate">{dept.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-[#1E834B] text-[#D9691F]' : 'bg-[#E8F7EE] text-[#22A25A]'
                      }`}>
                        {dept.doctors.length} Doc{dept.doctors.length === 1 ? '' : 's'}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#D9691F]" />}
                    </div>
                  </button>
                );
              })}

              {modalDepartments.length === 0 && (
                <div className="py-8 text-center text-xs text-[#6B7280] font-medium">
                  No department matching "{modalSearchTerm}"
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedDeptId('All');
                  setModalSearchTerm('');
                  setIsFilterModalOpen(false);
                }}
                className="px-4 py-2.5 text-xs font-bold text-[#D9691F] bg-[#FBEAE0] hover:bg-[#f7ded0] rounded-xl transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-5 py-2.5 bg-[#22A25A] text-white text-xs font-bold rounded-xl hover:bg-[#1E834B] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

