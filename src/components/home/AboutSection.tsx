import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Clock, CheckCircle2, ArrowRight, Accessibility, MapPin } from 'lucide-react';
import trustAndCareImg from '../../assets/images/trust_and_care_1787326594337.jpg';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-24 bg-white text-[#182334] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Hospital Facility Image & Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-white group">
              <img
                src={trustAndCareImg}
                alt="Compassionate Patient Care at Rafah-E-Aam Medical Centre"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                width="600"
                height="440"
                className="w-full h-[320px] sm:h-[400px] lg:h-[440px] object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Floating Location Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white p-3.5 rounded-2xl border border-[#E4E9E5] shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#22A25A] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#182334]">St-10, Block 13, Gulberg Town</p>
                  <p className="text-[11px] font-medium text-[#5F6875]">Karachi, Sindh, Pakistan</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: About Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-[#22A25A] font-extrabold text-xs tracking-wider uppercase bg-[#EFF4EC] px-4 py-1.5 rounded-full border border-[#E4E9E5]">
                <Building2 className="w-4 h-4 text-[#22A25A]" />
                ABOUT OUR CENTRE
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F28C45] bg-[#F28C45]/10 px-3.5 py-1.5 rounded-full border border-[#F28C45]/20 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#F28C45]" />
                <span>Open 24/7 in Gulberg Town</span>
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-4xl text-[#182334] leading-tight">
              Rafah-E-Aam Medical Centre
            </h2>

            {/* Description Paragraph */}
            <p className="text-[#5F6875] text-base sm:text-lg leading-relaxed font-medium">
              Located in Block 13, Gulberg Town, Karachi, Rafah-E-Aam Medical Centre is a premier community healthcare institution providing 24/7 emergency triage, orthopedic care, maternal health, and specialist OPD consultations across 15+ medical departments.
            </p>

            {/* Key Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-center gap-3 card-gradient p-3.5 rounded-2xl border border-[#E4E9E5] shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-[#22A25A] shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-[#182334]">34+ Specialist Doctors Panel</span>
              </div>

              <div className="flex items-center gap-3 card-gradient p-3.5 rounded-2xl border border-[#E4E9E5] shadow-2xs">
                <Accessibility className="w-5 h-5 text-[#22A25A] shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-[#182334]">Full Wheelchair Accessibility</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2.5 bg-[#22A25A] hover:bg-[#168A4A] text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer hover:gap-3.5"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
