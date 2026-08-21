import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Building2, Calendar, CheckCircle2, Phone, ShieldAlert, ArrowRight } from 'lucide-react';
import emergencyAmbulanceImg from '../../assets/images/emergency_ambulance_1785393504809.jpg';

export const HowItWorksSection: React.FC = () => {
  const STEPS = [
    {
      number: '01',
      title: 'Choose a Specialty',
      desc: 'Browse our 15+ medical departments including Cardiology, Orthopedics, Pediatrics, and Maternity Care.',
      icon: Building2,
    },
    {
      number: '02',
      title: 'Select Your Specialist',
      desc: 'Review profiles of 34+ senior consultant doctors, OPD room numbers, fees, and available timings.',
      icon: Calendar,
    },
    {
      number: '03',
      title: 'Book Your Appointment',
      desc: 'Reserve your appointment instantly online or call our 24/7 reception desk at Gulberg Town, Karachi.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white text-[#182334] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3.5">
          <span className="bg-[#EFF4EC] text-[#22A25A] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-2 border border-[#E4E9E5]">
            <Sparkles className="w-4 h-4 text-[#22A25A]" />
            EASY APPOINTMENT PROCESS
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#182334]">
            Your Care, Made Simple
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6875] leading-relaxed font-medium">
            Booking an OPD consultation at Rafah-E-Aam Medical Centre takes just three easy steps.
          </p>
        </div>

        {/* 3 Steps Cards Grid */}
        <div className="relative">
          {/* Subtle connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] -translate-y-6 h-0.5 border-t-2 border-dashed border-[#E4E9E5] pointer-events-none z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="card-gradient p-6 sm:p-7 rounded-3xl border border-[#E4E9E5] shadow-2xs hover:shadow-md transition-all space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#EFF4EC] text-[#22A25A] flex items-center justify-center font-bold shadow-xs">
                      <Icon className="w-6 h-6 text-[#22A25A]" />
                    </div>
                    <span className="text-2xl font-black text-[#F28C45] font-mono">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-lg text-[#182334]">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5F6875] leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 24/7 Emergency & Rapid Response Visual Banner */}
        <div className="bg-[#22A25A] text-white rounded-3xl overflow-hidden shadow-lg border border-[#168A4A] grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xs text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/20">
              <ShieldAlert className="w-4 h-4 text-[#F28C45]" />
              <span>24/7 Emergency Casualty Unit</span>
            </div>

            <h3 className="font-heading font-black text-2xl sm:text-3xl leading-tight">
              Immediate Care When Every Second Counts
            </h3>

            <p className="text-xs sm:text-sm text-[#EFF4EC] leading-relaxed max-w-xl">
              Our 24-hour casualty ward in Gulberg Town is equipped with on-call trauma surgeons, oxygen supplies, ECG monitoring, and dedicated ambulance rescue transport.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="tel:+922136342011"
                className="inline-flex items-center gap-2 bg-[#F28C45] hover:bg-[#E07B34] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Emergency: +92 21 36342011</span>
              </a>

              <Link
                to="/departments"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#EFF4EC] text-[#22A25A] font-bold text-xs sm:text-sm px-5 py-3 rounded-full shadow-xs transition-all"
              >
                <span>View Departments & Doctors</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 h-56 sm:h-72 lg:h-full relative overflow-hidden bg-[#168A4A]">
            <img
              src={emergencyAmbulanceImg}
              alt="24/7 Emergency Ambulance Service at Rafah-E-Aam Medical Centre Karachi"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              width="450"
              height="350"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#22A25A] via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

      </div>
    </section>
  );
};
