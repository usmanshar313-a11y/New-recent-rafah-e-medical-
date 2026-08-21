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
  HeartPulse,
  Navigation,
  ExternalLink
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#22A25A] text-white pt-12 pb-8 border-t border-[#168A4A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Section: Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
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
                <p className="text-xs text-[#EFF4EC]">General & Orthopedic Specialist Hospital</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Providing compassionate healthcare & modern medical facilities in Karachi.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#168A4A] text-xs font-medium text-white border border-white/10">
                <Accessibility className="w-3.5 h-3.5 text-[#EFF4EC]" />
                Wheelchair Accessible
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#168A4A] text-xs font-medium text-white border border-white/10">
                <Clock className="w-3.5 h-3.5 text-[#EFF4EC]" />
                24/7 Emergency Ward
              </span>
            </div>

            {/* Social Proof */}
            <div className="bg-[#168A4A]/80 p-3 rounded-xl border border-white/10 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1 text-[#F28C45] text-sm font-bold">
                  <Star className="w-4 h-4 fill-[#F28C45]" /> <span className="text-white">3.8 / 5.0</span>
                </div>
                <div className="text-xs text-white/80">Trusted by 50,000+ patients across Karachi</div>
              </div>
              <a
                href="https://www.google.com/maps?q=Rafah-E-Aam+Medical+Center+Karachi"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#EFF4EC] hover:text-white underline font-semibold flex items-center gap-1"
              >
                <span>Google Reviews</span>
                <ExternalLink className="w-3 h-3" />
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
                <Link to="/" className="hover:text-[#EFF4EC] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-[#EFF4EC] transition-colors">Departments & Doctors</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#EFF4EC] transition-colors">About Hospital</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#EFF4EC] transition-colors">Medical Services & OPD</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#EFF4EC] transition-colors">Contact & Directions</Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-[#EFF4EC] transition-colors text-white font-semibold underline underline-offset-2">
                  Patient Portal →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Medical Services */}
          <div>
            <h4 className="font-heading font-bold text-base text-white mb-4 border-b border-white/15 pb-2">
              Key Specialties
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/90">
              <li>General Medicine & OPD</li>
              <li>24/7 Emergency Casualty & Trauma</li>
              <li>Diagnostics & Ultrasound Lab</li>
              <li>Orthopedics & Fracture Care</li>
              <li>Cardiology & Heart Wellness</li>
              <li>Pediatrics & Child Health</li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div>
            <h4 className="font-heading font-bold text-base text-white mb-4 border-b border-white/15 pb-2">
              Hospital Contact
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-white/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#EFF4EC] mt-0.5 shrink-0" />
                <span>St-10, Block 13, Gulberg Town, Karachi, 78500, Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#EFF4EC] shrink-0" />
                <a href="tel:+922136342011" className="hover:underline font-semibold text-white">
                  +92 21 36342011
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#EFF4EC] shrink-0" />
                <span>Open 24 Hours, 7 Days a Week</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-b-0 border-white/15">
              <a
                href="tel:+922136342011"
                className="w-full bg-[#168A4A] hover:bg-[#168A4A]/90 text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Phone className="w-3.5 h-3.5" /> Call 24/7 Helpline
              </a>
            </div>
          </div>

        </div>

        {/* Hospital Location Interactive Map Banner */}
        <div className="bg-[#168A4A] rounded-3xl p-5 sm:p-6 border border-white/20 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white text-[#22A25A] flex items-center justify-center font-bold shrink-0">
                <MapPin className="w-4 h-4 text-[#22A25A]" />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-sm sm:text-base text-white">
                  Hospital Location Map & Directions
                </h4>
                <p className="text-xs text-[#EFF4EC]">
                  St-10, Block 13, Gulberg Town, Karachi — Accessible 24/7
                </p>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Block+13+Gulberg+Town+Karachi"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#EFF4EC] text-[#22A25A] px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5 text-[#22A25A]" />
              <span>Get Directions on Google Maps</span>
            </a>
          </div>

          {/* Embedded Google Map Frame */}
          <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-white/20 shadow-inner bg-slate-100">
            <iframe
              title="Rafah-E-Aam Medical Centre Footer Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.9048385002047!2d67.0805175!3d24.9353723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f37dbbe63eb%3A0xb35a39626e2e5055!2sBlock%2013%20Gulberg%20Town%2C%20Karachi!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/80">
          <div>
            © {new Date().getFullYear()} Rafah-E-Aam Medical Center (رفاہ عام میڈیکل سینٹر). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-[#EFF4EC] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#EFF4EC] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
