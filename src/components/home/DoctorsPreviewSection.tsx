import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCheck, Calendar, Clock, MapPin, ArrowRight, Stethoscope } from 'lucide-react';
import { ALL_DOCTORS } from '../../data/departmentsData';

interface DoctorsPreviewSectionProps {
  onOpenBooking?: () => void;
}

export const DoctorsPreviewSection: React.FC<DoctorsPreviewSectionProps> = ({ onOpenBooking }) => {
  // Select 4 prominent doctors representing different key specialties
  const FEATURED_DOCTOR_IDS = ['doc-1', 'doc-3', 'doc-25', 'doc-10'];
  const featuredDoctors = ALL_DOCTORS.filter((d) => FEATURED_DOCTOR_IDS.includes(d.id));

  return (
    <section className="py-16 sm:py-24 bg-white text-[#1F2937] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto space-y-3.5"
        >
          <span className="bg-[#E8F7EE] text-[#22A25A] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-2 border border-[#22A25A]/20">
            <UserCheck className="w-4 h-4 text-[#22A25A]" />
            SENIOR CONSULTANT PANEL
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#1F2937]">
            Meet Our Specialists
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-medium">
            Experienced consultants across multiple specialties, here to care for you and your family.
          </p>
        </motion.div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDoctors.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-4">
                {/* Doctor Photo Frame */}
                <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 border border-gray-100">
                  <img
                    src={doc.photoURL}
                    alt={doc.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-[#22A25A] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-2xs">
                    {doc.roomNumber}
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="space-y-1.5">
                  <h3 className="font-heading font-extrabold text-base text-[#1F2937] leading-snug group-hover:text-[#22A25A] transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-xs font-bold text-[#7A9B57] flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-[#7A9B57]" />
                    <span>{doc.specialty}</span>
                  </p>
                </div>

                <div className="bg-[#F9FAFB] p-3 rounded-2xl border border-gray-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[#1F2937]">
                    <span className="font-medium flex items-center gap-1 text-[#6B7280]">
                      <Calendar className="w-3 h-3 text-[#22A25A]" /> Days:
                    </span>
                    <span className="font-bold text-[#22A25A]">{doc.availableDays}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#1F2937]">
                    <span className="font-medium flex items-center gap-1 text-[#6B7280]">
                      <Clock className="w-3 h-3 text-[#22A25A]" /> Timing:
                    </span>
                    <span className="font-bold text-[#22A25A]">{doc.timing}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onOpenBooking}
                className="w-full bg-[#22A25A] hover:bg-[#1E834B] text-white py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* View All Doctors Button */}
        <div className="text-center pt-2">
          <Link
            to="/departments"
            className="inline-flex items-center gap-2.5 bg-[#22A25A] hover:bg-[#1E834B] text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer hover:gap-3.5"
          >
            <span>View All 34+ Doctors & Schedules</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
