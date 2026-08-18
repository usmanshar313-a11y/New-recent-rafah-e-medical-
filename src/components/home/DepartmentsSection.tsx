import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Stethoscope, 
  Heart, 
  Activity, 
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  Building2,
  Baby,
  FlaskConical
} from 'lucide-react';
import { getDepartmentTheme } from '../common/DepartmentIcon';

interface DepartmentsSectionProps {
  onOpenBooking?: () => void;
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({ onOpenBooking }) => {
  const FEATURED_DEPARTMENTS = [
    {
      id: 'gen-opd',
      name: 'General OPD & Internal Medicine',
      doctors: 'Dr. Ajmaal Jami, Dr. Saqib Zain, Dr. Bushra Rabbani',
      timing: '09:00 AM – 09:00 PM',
      days: 'Mon – Sat',
      fee: 'Rs. 1,000',
      icon: Stethoscope,
      bg: 'bg-[#C9DABF] text-[#3D6B4A]',
      desc: 'Adult outpatient care, hypertension, fever, diabetes screening, and routine health evaluations.'
    },
    {
      id: 'cardiology',
      name: 'Cardiology & Heart Care',
      doctors: 'Dr. Wajid Ali, Dr. Syed Saadat Ali, Dr. Usman Alam',
      timing: '02:00 PM – 09:00 PM',
      days: 'Mon – Sat',
      fee: 'Rs. 1,500',
      icon: Heart,
      bg: 'bg-[#C9DABF] text-[#3D6B4A]',
      desc: 'Expert cardiac consultations, ECG diagnostics, BP regulation, and heart wellness.'
    },
    {
      id: 'orthopedics',
      name: 'Orthopedics & Joint Surgery',
      doctors: 'Dr. Akhtar Baig',
      timing: '06:00 PM – 09:00 PM',
      days: 'Mon – Sat',
      fee: 'Rs. 1,500',
      icon: Activity,
      bg: 'bg-[#C9DABF] text-[#3D6B4A]',
      desc: 'Fracture alignment, joint arthritis, back pain management, and spinal disorder consultations.'
    },
    {
      id: 'pediatrics',
      name: 'Pediatrics & Child Health',
      doctors: 'Dr. Hira, Dr. S.M. Hussain Hadi Naqvi, Dr. Amir Hussain',
      timing: '10:00 AM – 11:00 PM',
      days: 'Mon – Sat',
      fee: 'Rs. 1,000',
      icon: Baby,
      bg: 'bg-[#C9DABF] text-[#3D6B4A]',
      desc: 'Childhood healthcare, growth monitoring, infant nutrition, and vaccination programs.'
    }
  ];

  return (
    <section id="departments" className="py-16 sm:py-24 bg-white text-[#182334] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto space-y-3.5"
        >
          <span className="bg-[#EFF4EC] text-[#22A25A] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-2 border border-[#E4E9E5]">
            <Building2 className="w-4 h-4 text-[#22A25A]" />
            FEATURED MEDICAL SERVICES
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#182334]">
            Specialized Departments & OPDs
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6875] leading-relaxed font-medium">
            Rafah-E-Aam Medical Centre features 15+ specialized medical departments and 34+ senior consultant doctors. Explore featured specialties or view our full OPD schedule.
          </p>
        </motion.div>

        {/* 4 Featured Department Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_DEPARTMENTS.map((dept, idx) => {
            const Icon = dept.icon;
            const theme = getDepartmentTheme(dept.id);

            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`card-gradient p-6 rounded-3xl border border-[#E4E9E5] ${theme.hoverBorder} shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5 group`}
                style={{ borderTopWidth: '4px', borderTopColor: theme.primary }}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl ${theme.bgTint} ${theme.iconColor} border ${theme.borderTint} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-extrabold text-white bg-[#F28C45] px-2.5 py-1 rounded-full shadow-2xs">
                      Fee: {dept.fee}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#182334] leading-snug group-hover:text-[#22A25A] transition-colors">
                    {dept.name}
                  </h3>

                  <p className="text-xs text-[#5F6875] leading-relaxed font-medium">
                    {dept.desc}
                  </p>

                  <div className={`${theme.bgTint} p-3 rounded-2xl border ${theme.borderTint} text-xs text-[#182334]`}>
                    <span className={`font-bold ${theme.textTint}`}>Consultants: </span>
                    <span className="text-[#5F6875]">{dept.doctors}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E4E9E5] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#182334]">
                    <span className="text-[#5F6875] font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#22A25A] shrink-0" /> Days:
                    </span>
                    <span className="font-bold text-[#182334]">{dept.days}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#182334]">
                    <span className="text-[#5F6875] font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#22A25A] shrink-0" /> Timing:
                    </span>
                    <span className="font-bold text-[#182334]">{dept.timing}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#EFF4EC] rounded-3xl p-6 sm:p-8 border border-[#E4E9E5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-3.5 text-xs sm:text-sm text-[#182334] font-medium text-center sm:text-left">
            <CheckCircle2 className="w-5 h-5 text-[#22A25A] shrink-0" />
            <span>Discover all 15+ departments, 34+ senior doctor profiles, OPD room numbers, and timings.</span>
          </div>

          <Link
            to="/departments"
            className="w-full sm:w-auto bg-[#22A25A] hover:bg-[#168A4A] text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer hover:gap-3 shrink-0"
          >
            <span>View All Departments & Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};
