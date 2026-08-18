import React from 'react';
import { motion } from 'motion/react';
import { Clock, UserCheck, Stethoscope, Accessibility, ShieldCheck, HeartHandshake } from 'lucide-react';
import facilityRoomImg from '../../assets/images/facility_patient_room_1785393530865.jpg';

export const WhyChooseSection: React.FC = () => {
  const PILLARS = [
    {
      icon: Clock,
      title: '24/7 Emergency & Casualty Care',
      desc: 'Round-the-clock emergency triage, trauma stabilization, medical oxygen, and urgent casualty assistance in Gulberg Town.',
    },
    {
      icon: UserCheck,
      title: '34+ Senior Specialist Doctors',
      titleHighlight: '34+ Specialists',
      desc: 'Highly experienced consultants across cardiology, orthopedics, laparoscopic surgery, pediatrics, and gynecology.',
    },
    {
      icon: Stethoscope,
      title: '15+ Medical Departments & Sonology',
      desc: 'Comprehensive OPD services, diagnostic laboratory, ultrasound sonography, and specialized patient care under one roof.',
    },
    {
      icon: Accessibility,
      title: 'Full Wheelchair Accessibility',
      desc: 'Step-free access, wide corridors, patient-first facility layout, and compassionate medical care for senior citizens.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white text-[#182334] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 space-y-12">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto space-y-3.5"
        >
          <span className="bg-[#EFF4EC] text-[#22A25A] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-2 border border-[#E4E9E5]">
            <HeartHandshake className="w-4 h-4 text-[#22A25A]" />
            WHY FAMILIES CHOOSE US
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#182334]">
            Trusted Healthcare in Gulberg Town
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6875] leading-relaxed font-medium">
            Rafah-E-Aam Medical Centre combines expert medical consultants, 24/7 emergency readiness, and patient-centered care.
          </p>
        </motion.div>

        {/* Content Layout: Left Image + Right 2x2 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT: Hospital Room Image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-white group">
              <img
                src={facilityRoomImg}
                alt="Rafah-E-Aam Patient Care Room"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-[320px] sm:h-[400px] lg:h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E4E9E5] shadow-md flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#22A25A] shrink-0" />
                <p className="text-xs font-extrabold text-[#182334] leading-snug">
                  Compassionate care, clean facilities, and affordable fees.
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: 2x2 Feature Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="card-gradient p-5 sm:p-6 rounded-3xl border border-[#E4E9E5] shadow-2xs hover:border-[#22A25A]/40 transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#EFF4EC] text-[#22A25A] flex items-center justify-center font-bold shrink-0">
                    <Icon className="w-5 h-5 text-[#22A25A]" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-[#182334] leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#5F6875] leading-relaxed font-medium">
                    {pillar.desc}
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
