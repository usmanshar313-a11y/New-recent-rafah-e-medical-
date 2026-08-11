import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  ShieldAlert, 
  FlaskConical, 
  HeartHandshake, 
  Baby, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectService?: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = () => {
  return (
    <section id="services" className="py-16 bg-[#F1E9D8] text-[#3A362E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="bg-[#C9DABF]/60 text-[#3D6B4A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#8DAA91]/40">
            Clinical Care Preview
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#4A7C59]">
            Our Clinical & Medical Services
          </h2>
          <p className="text-xs sm:text-sm text-[#3A362E]/80">
            Rafah-E-Aam Medical Centre provides high quality medical diagnostics, general OPD, orthopedic surgery, cardiology, maternity, and round-the-clock emergency care.
          </p>
        </div>

        {/* Homepage Summary Card for Services */}
        <div className="bg-white/80 rounded-3xl p-8 border border-[#8DAA91]/30 shadow-md max-w-4xl mx-auto space-y-8">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#8DAA91]/30 flex items-center gap-3 shadow-xs">
              <div className="p-2.5 bg-[#C9DABF]/60 rounded-xl text-[#3D6B4A]">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-bold text-xs sm:text-sm text-[#4A7C59]">General OPD</div>
                <div className="text-[11px] text-[#3A362E]/80">Adult & Family Medicine</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#8DAA91]/30 flex items-center gap-3 shadow-xs">
              <div className="p-2.5 bg-[#C9DABF]/60 rounded-xl text-[#3D6B4A]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-bold text-xs sm:text-sm text-[#4A7C59]">24/7 Emergency</div>
                <div className="text-[11px] text-[#3D6B4A] font-semibold">Trauma & Casualty</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#8DAA91]/30 flex items-center gap-3 shadow-xs">
              <div className="p-2.5 bg-[#C9DABF]/60 rounded-xl text-[#3D6B4A]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-bold text-xs sm:text-sm text-[#4A7C59]">Orthopedics</div>
                <div className="text-[11px] text-[#3A362E]/80">Bones, Joints & Trauma</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#8DAA91]/30 flex items-center gap-3 shadow-xs">
              <div className="p-2.5 bg-[#C9DABF]/60 rounded-xl text-[#3D6B4A]">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-bold text-xs sm:text-sm text-[#4A7C59]">Diagnostics</div>
                <div className="text-[11px] text-[#3A362E]/80">Ultrasound & Lab</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#8DAA91]/30 flex items-center gap-3 shadow-xs">
              <div className="p-2.5 bg-[#C9DABF]/60 rounded-xl text-[#3D6B4A]">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-bold text-xs sm:text-sm text-[#4A7C59]">Pediatrics</div>
                <div className="text-[11px] text-[#3A362E]/80">Child & Neonatal Care</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#8DAA91]/30 flex items-center gap-3 shadow-xs">
              <div className="p-2.5 bg-[#C9DABF]/60 rounded-xl text-[#3D6B4A]">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-bold text-xs sm:text-sm text-[#4A7C59]">Surgery</div>
                <div className="text-[11px] text-[#3A362E]/80">Laparoscopic & General</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#8DAA91]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#3A362E] font-medium text-center sm:text-left">
              <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0" />
              <span>Over 15+ specialized medical departments and diagnostic units available.</span>
            </div>

            <Link
              to="/services"
              className="w-full sm:w-auto bg-[#3D6B4A] hover:bg-[#32583d] text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer hover:gap-3"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
