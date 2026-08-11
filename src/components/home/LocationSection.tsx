import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, PhoneCall, Calendar, Navigation, ArrowRight } from 'lucide-react';

interface LocationSectionProps {
  onOpenBooking?: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="location" className="py-16 sm:py-24 bg-[#F1E9D8] text-[#3A362E] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-[#8DAA91]/30 shadow-sm text-center space-y-6"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-[#C9DABF]/60 text-[#3D6B4A] text-xs font-bold px-4 py-1.5 rounded-full border border-[#8DAA91]/40">
            <MapPin className="w-4 h-4 text-[#3D6B4A]" />
            <span>Rafah-E-Aam Medical Centre — Gulberg Town</span>
          </div>

          {/* Headline */}
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#4A7C59]">
            Ready to Take the Next Step?
          </h2>

          {/* Supporting Text */}
          <p className="text-xs sm:text-base text-[#3A362E]/80 font-medium max-w-xl mx-auto leading-relaxed">
            Our team is here to help you find the right care. Book an appointment online or call our 24/7 reception desk for immediate assistance.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto bg-[#3D6B4A] hover:bg-[#32583d] text-white py-3.5 px-7 rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-[#3D6B4A]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Book an Appointment</span>
            </button>

            <a
              href="tel:+922136342011"
              className="w-full sm:w-auto bg-[#F1E9D8] hover:bg-[#C9DABF]/40 text-[#3A362E] border border-[#8DAA91]/40 py-3.5 px-7 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#4A7C59]" />
              <span>Call Now</span>
            </a>
          </div>

          {/* Address Details */}
          <div className="pt-4 border-t border-[#8DAA91]/30 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#3A362E]/80">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#4A7C59]" />
              <span>St-10, Block 13, Gulberg Town, Karachi</span>
            </div>
            <span>•</span>
            <Link to="/contact#map" className="text-[#4A7C59] font-bold hover:underline inline-flex items-center gap-1">
              <Navigation className="w-3 h-3 text-[#4A7C59]" /> Get Directions
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
