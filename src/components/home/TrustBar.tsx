import React from 'react';
import { motion } from 'framer-motion';
import { Clock, UserCheck, Stethoscope, Accessibility } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const TRUST_ITEMS = [
    {
      icon: Clock,
      label: '24/7 Emergency Care',
      detail: 'Round-the-clock casualty triage & ER',
    },
    {
      icon: UserCheck,
      label: '34+ Specialist Doctors',
      detail: 'Experienced senior consultants',
    },
    {
      icon: Stethoscope,
      label: '15+ OPD Departments',
      detail: 'Comprehensive medical specialties',
    },
    {
      icon: Accessibility,
      label: 'Wheelchair Accessible',
      detail: 'Step-free access & patient comfort',
    },
  ];

  return (
    <section className="bg-white border-y border-emerald-900/10 py-6 relative z-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center">
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="flex items-center gap-3.5 group"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#0B6B4E]/10 text-[#0B6B4E] flex items-center justify-center shrink-0 group-hover:bg-[#0B6B4E] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#032d20] leading-tight">
                    {item.label}
                  </h4>
                  <p className="text-[11px] sm:text-xs font-medium text-emerald-950/65 leading-tight mt-0.5">
                    {item.detail}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
