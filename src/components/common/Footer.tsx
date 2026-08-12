import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Accessibility, 
  Star, 
  ShieldCheck, 
  HeartPulse 
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#22A25A] text-white pt-12 pb-8 border-t border-[#1E834B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Clinic Overview & Proof */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#22A25A] flex items-center justify-center font-bold shadow-xs">
                <HeartPulse className="w-6 h-6 text-[#22A25A]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-white">
                  Rafah-E-Aam Medical Centre
                </h3>
                <p className="text-xs text-[#E8F7EE]">General & Orthopedic Specialist Hospital</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Providing compassionate healthcare & modern medical facilities in Karachi
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1E834B] text-xs font-medium text-white border border-white/10">
                <Accessibility className="w-3.5 h-3.5 text-[#E8F7EE]" />
                Wheelchair & Stretcher Accessible
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1E834B] text-xs font-medium text-white border border-white/10">
                <Clock className="w-3.5 h-3.5 text-[#E8F7EE]" />
                24/7 Emergency Ward
              </span>
            </div>

            {/* Social Proof */}
            <div className="bg-[#1E834B]/80 p-3 rounded-xl border border-white/10 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1 text-[#D9691F] text-sm font-bold">
                  <Star className="w-4 h-4 fill-[#D9691F]" /> <span className="text-white">3.8 / 5.0</span>
                </div>
                <div className="text-xs text-white/80">Trusted by over 50,000+ patients across Karachi</div>
              </div>
              <a
                href="https://www.google.com/maps?q=Rafah-E-Aam+Medical+Center+Karachi"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#FBEAE0] hover:text-white underline font-semibold"
              >
                Google Reviews
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-base text-white mb-4 border-b border-white/15 pb-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/90">
              <li>
                <Link to="/" className="hover:text-[#FBEAE0] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-[#FBEAE0] transition-colors">Departments & Doctors</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FBEAE0] transition-colors">About Hospital</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FBEAE0] transition-colors">Contact & Location</Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-[#FBEAE0] transition-colors text-[#FBEAE0] font-semibold">
                  Patient Portal →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Medical Services */}
          <div>
            <h4 className="font-heading font-bold text-base text-white mb-4 border-b border-white/15 pb-2">
              Departments & Care
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/90">
              <li>General Medicine & OPD</li>
              <li>24/7 Emergency Care</li>
              <li>Diagnostics & Laboratory</li>
              <li>Pharmacy (24 Hours)</li>
              <li>Maternity & Gynecological Care</li>
              <li>Pediatrics & Child Health</li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div>
            <h4 className="font-heading font-bold text-base text-white mb-4 border-b border-white/15 pb-2">
              Hospital Location
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-white/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E8F7EE] mt-0.5 shrink-0" />
                <span>St-10, Block 13, Gulberg Town, Karachi, 78500, Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E8F7EE] shrink-0" />
                <a href="tel:+922136342011" className="hover:underline font-semibold text-white">
                  +92 21 36342011
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#E8F7EE] shrink-0" />
                <span>Open 24 Hours, 7 Days a Week</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-b-0 border-white/15">
              <a
                href="tel:+922136342011"
                className="w-full bg-[#1E834B] hover:bg-[#196B3E] text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" /> Call 24/7 Helpline
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/80">
          <div>
            © {new Date().getFullYear()} Rafah-E-Aam Medical Center (رفاہ عام میڈیکل سینٹر). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-[#FBEAE0] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#FBEAE0] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
