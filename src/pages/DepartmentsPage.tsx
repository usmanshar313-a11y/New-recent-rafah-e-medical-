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
    <div ref={containerRef} className="bg-white min-h-screen py-8 sm:py-10 text-[#182334]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

        {/* Hero Banner Section */}
        <div className="dept-hero-content bg-[#22A25A] text-white rounded-3xl p-7 sm:p-12 shadow-xs relative overflow-hidden border border-[#168A4A]">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="max-w-3xl space-y-3 sm:space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#168A4A] border border-white/20 text-xs font-extrabold uppercase tracking-wider text-white">
              <Sparkles className="w-4 h-4 text-[#F28C45]" />
              <span>Rafah-e-Aam Medical Centre OPD</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-5xl tracking-tight leading-tight text-white">
              Medical Departments & Specialists
            </h1>
            <p className="text-xs sm:text-base text-[#EFF4EC] font-medium leading-relaxed max-w-2xl">
              Select a specialized medical department below to view consulting doctors, OPD schedules, room locations, and book your visit directly.
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="dept-search-bar bg-white p-4 sm:p-6 rounded-2xl border border-[#E4E9E5] shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          
          {/* Text Search Input */}
          <div className="relative flex-1">
            <Search className="w-4.5 h-4.5 text-[#22A25A] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search department, doctor, or specialty..."
              className="w-full pl-11 pr-10 py-3 bg-[#F5F1E8]/40 border border-[#E4E9E5] rounded-xl text-xs sm:text-sm font-semibold text-[#182334] placeholder:text-[#5F6875]/60 focus:outline-hidden focus:ring-2 focus:ring-[#22A25A] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#22A25A] hover:text-[#168A4A] bg-[#EFF4EC] px-2 py-1 rounded-md cursor-pointer"
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
                  ? 'bg-[#168A4A] text-white border-[#168A4A] shadow-2xs'
                  : 'bg-[#F5F1E8]/40 text-[#182334] border-[#E4E9E5] hover:bg-[#EFF4EC]/50'
              }`}
            >
              <Filter className="w-4 h-4 shrink-0" />
              <span className="truncate max-w-[180px] sm:max-w-[220px]">
                {selectedDeptId === 'All'
                  ? 'Filter by Department'
                  : `Dept: ${selectedDepartmentObj?.name || selectedDeptId}`}
              </span>
              {selectedDeptId !== 'All' && (
                <span className="bg-[#F28C45] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                  1
                </span>
              )}
            </button>

            {selectedDeptId !== 'All' && (
              <button
                onClick={() => setSelectedDeptId('All')}
                title="Reset Department Filter"
                className="p-3 rounded-xl bg-[#F28C45]/10 text-[#F28C45] border border-[#F28C45]/30 hover:bg-[#F28C45]/20 transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results Counter & Active Filter Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-bold text-[#5F6875] px-1">
          <div className="flex items-center gap-2">
            <span>Showing {filteredDepartments.length} Department{filteredDepartments.length === 1 ? '' : 's'}</span>
            {selectedDeptId !== 'All' && selectedDepartmentObj && (
              <span className="bg-[#EFF4EC] text-[#22A25A] px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 border border-[#E4E9E5]">
                <span>{selectedDepartmentObj.name}</span>
                <button
                  onClick={() => setSelectedDeptId('All')}
                  className="hover:text-[#F28C45] cursor-pointer"
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
          <div className="bg-white p-10 sm:p-12 rounded-3xl border border-[#E4E9E5] text-center space-y-4">
            <p className="text-base font-bold text-[#22A25A]">No matching medical departments found</p>
            <p className="text-xs text-[#5F6875]">Try adjusting your search text or department filter selection.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDeptId('All');
              }}
              className="px-5 py-2.5 bg-[#22A25A] text-white text-xs font-bold rounded-xl hover:bg-[#168A4A] transition-colors cursor-pointer"
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
                  className={`dept-card bg-white rounded-3xl border border-[#E4E9E5] shadow-2xs hover:shadow-md ${theme.hoverBorder} transition-all flex flex-col lg:flex-row overflow-hidden group`}
                >
                  {/* Left / Upper Block: Tinted Header Zone */}
                  <div className={`p-6 sm:p-7 ${theme.bgTint} border-b lg:border-b-0 lg:border-r border-[#E4E9E5] flex flex-col justify-between space-y-4 shrink-0 lg:w-[300px] xl:w-[340px]`}>
                    <div className="flex items-start gap-4">
                      {/* Department Icon */}
                      <div className={`p-3.5 bg-white rounded-2xl border border-[#E4E9E5] shadow-2xs shrink-0 ${theme.iconColor}`}>
                        <DepartmentIcon iconType={dept.icon} deptId={dept.id} className="w-7 h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[#182334] leading-snug group-hover:text-[#22A25A] transition-colors">
                          {dept.name}
                        </h2>
                        <div className={`mt-2 inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${theme.badgeBorder} ${theme.badgeBg} ${theme.badgeText}`}>
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
                    <p className="text-xs sm:text-sm text-[#5F6875] font-medium leading-relaxed">
                      {dept.description}
                    </p>
                  </div>

                  {/* Right / Schedule Block: Days, Timings, Fee & Show Doctors CTA */}
                  <div className="p-6 sm:p-7 bg-[#F5F1E8]/30 border-t lg:border-t-0 lg:border-l border-[#E4E9E5] flex flex-col justify-between space-y-5 lg:w-[290px] xl:w-[310px] shrink-0">
                    <div className="space-y-2.5 text-xs text-[#182334]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium text-[#5F6875]">
                          <Calendar className="w-3.5 h-3.5 text-[#22A25A]" /> Days:
                        </span>
                        <span className="font-bold text-[#182334]">{dept.days || 'Mon - Sat'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium text-[#5F6875]">
                          <Clock className="w-3.5 h-3.5 text-[#22A25A]" /> Timing:
                        </span>
                        <span className="font-bold text-[#182334]">{dept.timing || '09:00 AM - 05:00 PM'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium text-[#5F6875]">
                          <Banknote className="w-3.5 h-3.5 text-[#22A25A]" /> Fee:
                        </span>
                        <span className="font-extrabold text-[#F28C45] bg-[#F28C45]/10 px-2.5 py-1 rounded-full border border-[#F28C45]/20">{dept.fee || 'Rs. 1,000'}</span>
                      </div>
                    </div>

                    {/* Primary Dedicated CTA Button */}
                    <Link
                      to={`/departments/${dept.id}`}
                      className="w-full bg-[#22A25A] hover:bg-[#168A4A] active:bg-[#168A4A] text-white py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer group/btn"
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
            className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl border border-[#E4E9E5] overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#E4E9E5] flex items-center justify-between bg-[#F5F1E8]/40">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#182334]">
                  Filter by Department
                </h3>
                <p className="text-xs text-[#5F6875] font-medium mt-0.5">
                  Select a medical specialty to narrow down departments
                </p>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 text-[#5F6875] hover:text-[#182334] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Quick Search */}
            <div className="p-4 border-b border-[#E4E9E5] bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-[#22A25A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                  placeholder="Type to filter departments list..."
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F5F1E8]/40 border border-[#E4E9E5] rounded-xl text-xs font-semibold text-[#182334] focus:outline-hidden focus:ring-2 focus:ring-[#22A25A]"
                />
              </div>
            </div>

            {/* Department List Options */}
            <div className="p-3 sm:p-4 overflow-y-auto space-y-1.5 flex-1 divide-y divide-[#E4E9E5]">
              {/* All Departments Option */}
              <button
                onClick={() => {
                  setSelectedDeptId('All');
                  setIsFilterModalOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedDeptId === 'All'
                    ? 'bg-[#22A25A] text-white'
                    : 'hover:bg-[#EFF4EC] text-[#182334]'
                }`}
              >
                <span>All Departments ({departments.length})</span>
                {selectedDeptId === 'All' && <Check className="w-4 h-4 text-[#F28C45]" />}
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
                        : 'hover:bg-[#EFF4EC] text-[#182334]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-1.5 rounded-lg border shrink-0 ${isSelected ? 'bg-white/20 text-white border-transparent' : `${theme.bgTint} ${theme.iconColor} border-[#E4E9E5]`}`}>
                        <DepartmentIcon iconType={dept.icon} deptId={dept.id} className="w-4 h-4" />
                      </div>
                      <span className="truncate">{dept.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-[#168A4A] text-[#F28C45]' : 'bg-[#EFF4EC] text-[#22A25A]'
                      }`}>
                        {dept.doctors.length} Doc{dept.doctors.length === 1 ? '' : 's'}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#F28C45]" />}
                    </div>
                  </button>
                );
              })}

              {modalDepartments.length === 0 && (
                <div className="py-8 text-center text-xs text-[#5F6875] font-medium">
                  No department matching "{modalSearchTerm}"
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E4E9E5] bg-[#F5F1E8]/40 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedDeptId('All');
                  setModalSearchTerm('');
                  setIsFilterModalOpen(false);
                }}
                className="px-4 py-2.5 text-xs font-bold text-[#F28C45] bg-[#F28C45]/10 hover:bg-[#F28C45]/20 rounded-xl transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-5 py-2.5 bg-[#22A25A] text-white text-xs font-bold rounded-xl hover:bg-[#168A4A] transition-colors cursor-pointer"
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

