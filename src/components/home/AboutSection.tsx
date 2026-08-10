import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Clock, CheckCircle2, ArrowRight, Accessibility, MapPin, Award } from 'lucide-react';
import facilityTreatmentImg from '../../assets/images/facility_treatment_1785393518585.jpg';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-24 bg-[#FAF8F3] text-[#0B6B4E] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Hospital Facility Image & Badge */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl shadow-emerald-950/10 bg-emerald-900/5 group">
              <img
                src={facilityTreatmentImg}
                alt="Rafah-E-Aam Medical Centre Treatment Facility"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-[320px] sm:h-[400px] lg:h-[440px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Floating Location Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-900/10 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B6B4E] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#032d20]">St-10, Block 13, Gulberg Town</p>
                  <p className="text-[11px] font-medium text-emerald-800/80">Karachi, Sindh, Pakistan</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: About Content */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-[#0B6B4E] font-extrabold text-xs tracking-wider uppercase bg-[#0B6B4E]/10 px-4 py-1.5 rounded-full border border-[#0B6B4E]/15">
                <Building2 className="w-4 h-4 text-[#0B6B4E]" />
                ABOUT OUR CENTRE
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-white px-3.5 py-1.5 rounded-full border border-emerald-900/15 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#D64545]" />
                <span>Open 24/7 in Gulberg Town</span>
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-4xl text-[#032d20] leading-tight">
              Rafah-E-Aam Medical Centre
            </h2>

            {/* Description Paragraph */}
            <p className="text-emerald-950/80 text-base sm:text-lg leading-relaxed font-medium">
              Located in Block 13, Gulberg Town, Karachi, Rafah-E-Aam Medical Centre is a premier community healthcare institution providing 24/7 emergency triage, orthopedic care, maternal health, and specialist OPD consultations across 15+ medical departments.
            </p>

            {/* Key Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-emerald-900/10 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-[#032d20]">34+ Specialist Doctors Panel</span>
              </div>

              <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-emerald-900/10 shadow-2xs">
                <Accessibility className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-[#032d20]">Full Wheelchair Accessibility</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2.5 bg-[#0B6B4E] hover:bg-[#08523c] text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer hover:gap-3.5"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
