import React from 'react';
import { motion } from 'motion/react';
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
    <section className="bg-white border-y border-[#E4E9E5] py-6 relative z-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center">
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isOrangeChip = idx % 2 === 1;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="flex items-center gap-3.5 group"
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    isOrangeChip
                      ? 'bg-[#F28C45]/10 text-[#F28C45] group-hover:bg-[#F28C45] group-hover:text-white'
                      : 'bg-[#EFF4EC] text-[#22A25A] group-hover:bg-[#22A25A] group-hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#182334] leading-tight">
                    {item.label}
                  </h4>
                  <p className="text-[11px] sm:text-xs font-medium text-[#5F6875] leading-tight mt-0.5">
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
