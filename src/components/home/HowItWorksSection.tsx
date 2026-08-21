import React from 'react';
import { Sparkles, Building2, Calendar, CheckCircle2 } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3.5 gsap-reveal">
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
                  className="card-gradient p-6 sm:p-7 rounded-3xl border border-[#E4E9E5] shadow-2xs hover:shadow-md transition-all space-y-4 relative gsap-reveal"
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

      </div>
    </section>
  );
};
