import React from 'react';
import { motion } from 'framer-motion';
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
    <section className="py-16 sm:py-20 bg-[#F1E9D8] text-[#3A362E] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto space-y-3.5"
        >
          <span className="bg-[#C9DABF]/60 text-[#3D6B4A] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-2 border border-[#8DAA91]/40">
            <Sparkles className="w-4 h-4 text-[#3D6B4A]" />
            EASY APPOINTMENT PROCESS
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#4A7C59]">
            Your Care, Made Simple
          </h2>
          <p className="text-xs sm:text-sm text-[#3A362E]/80 leading-relaxed font-medium">
            Booking an OPD consultation at Rafah-E-Aam Medical Centre takes just three easy steps.
          </p>
        </motion.div>

        {/* 3 Steps Cards Grid */}
        <div className="relative">
          {/* Subtle connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] -translate-y-6 h-0.5 border-t-2 border-dashed border-[#8DAA91]/40 pointer-events-none z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white/80 p-6 sm:p-7 rounded-3xl border border-[#8DAA91]/30 shadow-2xs hover:shadow-md transition-all space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#4A7C59] text-white flex items-center justify-center font-bold shadow-xs">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black text-[#8DAA91]/50 font-mono">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-lg text-[#4A7C59]">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#3A362E]/80 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
