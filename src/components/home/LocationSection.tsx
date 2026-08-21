import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, PhoneCall, Calendar, Navigation } from 'lucide-react';

interface LocationSectionProps {
  onOpenBooking?: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="location" className="py-16 sm:py-24 bg-white text-[#182334] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="card-gradient rounded-3xl p-8 sm:p-12 border border-[#E4E9E5] shadow-sm text-center space-y-6 gsap-reveal">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-[#EFF4EC] text-[#22A25A] text-xs font-bold px-4 py-1.5 rounded-full border border-[#E4E9E5]">
            <MapPin className="w-4 h-4 text-[#22A25A]" />
            <span>Rafah-E-Aam Medical Centre — Gulberg Town</span>
          </div>

          {/* Headline */}
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#182334]">
            Ready to Take the Next Step?
          </h2>

          {/* Supporting Text */}
          <p className="text-xs sm:text-base text-[#5F6875] font-medium max-w-xl mx-auto leading-relaxed">
            Our team is here to help you find the right care. Book an appointment online or call our 24/7 reception desk for immediate assistance.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto bg-[#22A25A] hover:bg-[#168A4A] text-white py-3.5 px-7 rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-[#22A25A]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Book an Appointment</span>
            </button>

            <a
              href="tel:+922136342011"
              className="w-full sm:w-auto bg-white hover:bg-[#F28C45]/5 text-[#F28C45] border border-[#F28C45] py-3.5 px-7 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#F28C45]" />
              <span>Call Now</span>
            </a>
          </div>

          {/* Address Details */}
          <div className="pt-4 border-t border-[#E4E9E5] flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#5F6875]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#22A25A]" />
              <span>St-10, Block 13, Gulberg Town, Karachi</span>
            </div>
            <span>•</span>
            <Link to="/contact#map" className="text-[#22A25A] font-bold hover:underline inline-flex items-center gap-1">
              <Navigation className="w-3 h-3 text-[#22A25A]" /> Get Directions
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
