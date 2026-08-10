import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, PhoneCall, Calendar, Navigation, ArrowRight } from 'lucide-react';

interface LocationSectionProps {
  onOpenBooking?: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="location" className="py-16 sm:py-24 bg-[#F5F1E8] text-[#0B6B4E] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-900/10 shadow-sm text-center space-y-6"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-[#FAF8F3] text-[#0B6B4E] text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-900/10">
            <MapPin className="w-4 h-4 text-[#D64545]" />
            <span>Rafah-E-Aam Medical Centre — Gulberg Town</span>
          </div>

          {/* Headline */}
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#032d20]">
            Ready to Take the Next Step?
          </h2>

          {/* Supporting Text */}
          <p className="text-xs sm:text-base text-emerald-950/80 font-medium max-w-xl mx-auto leading-relaxed">
            Our team is here to help you find the right care. Book an appointment online or call our 24/7 reception desk for immediate assistance.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto bg-[#D64545] hover:bg-[#c23737] text-white py-3.5 px-7 rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-[#D64545]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book an Appointment</span>
            </button>

            <a
              href="tel:+922136342011"
              className="w-full sm:w-auto bg-[#FAF8F3] hover:bg-emerald-50 text-[#0B6B4E] border border-emerald-900/15 py-3.5 px-7 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#D64545]" />
              <span>Call Now</span>
            </a>
          </div>

          {/* Address Details */}
          <div className="pt-4 border-t border-emerald-900/10 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-emerald-950/75">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0B6B4E]" />
              <span>St-10, Block 13, Gulberg Town, Karachi</span>
            </div>
            <span>•</span>
            <Link to="/contact#map" className="text-[#0B6B4E] font-bold hover:underline inline-flex items-center gap-1">
              <Navigation className="w-3 h-3" /> Get Directions
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
