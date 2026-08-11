import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Phone, ShieldCheck } from 'lucide-react';
import heroReceptionImg from '../../assets/images/hero_reception_1785393482596.jpg';

interface HeroProps {
  onOpenBooking?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const navigate = useNavigate();

  const handleBookClick = () => {
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      navigate('/departments');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative bg-[#F1E9D8] pt-[clamp(1px,3vw,5px)] pb-[clamp(55px,6vw,70px)] overflow-hidden">
      {/* Subtle Ambient Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#4A7C59]/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F1E9D8]/50 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-12 xl:gap-14 items-center">
          
          {/* LEFT SIDE: Typography & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-[560px] space-y-5 sm:space-y-6 text-left mx-auto lg:mx-0"
          >
            {/* Eyebrow */}
            <div>
              <span className="inline-block text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#3D6B4A] bg-[#C9DABF]/60 px-4 py-1.5 rounded-full border border-[#8DAA91]/40">
                GENERAL & ORTHOPAEDIC CARE
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(40px,4.5vw,60px)] font-extrabold text-[#4A7C59] leading-[1.15] tracking-tight max-w-[540px]">
              Trusted care for{' '}
              <span className="text-[#3D6B4A] font-black relative inline-block text-4xl sm:text-5xl lg:text-6xl"
                style={{ fontFamily: '"Segoe Script", "Brush Script MT", "Comic Sans MS", cursive' }}
              >
                every
              </span>{' '}
              stage of life
            </h1>

            {/* Short Description */}
            <p className="text-[#3A362E] text-base sm:text-lg font-medium leading-relaxed max-w-[500px]">
              Compassionate healthcare, modern diagnostics, and expert medical care for you and your family.
            </p>

            {/* Action Buttons */}
            <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
              <button
                onClick={handleBookClick}
                className="bg-[#3D6B4A] hover:bg-[#32583d] text-white px-7 py-3.5 rounded-full text-sm sm:text-base font-bold shadow-lg shadow-[#3D6B4A]/20 hover:-translate-y-0.5 active:scale-95 transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span>Book an Appointment</span>
              </button>

              <a
                href="tel:+922136342011"
                className="bg-[#F1E9D8] hover:bg-[#C9DABF]/50 text-[#3D6B4A] border border-[#3D6B4A]/30 px-6 py-3.5 rounded-full text-sm sm:text-base font-bold shadow-xs hover:-translate-y-0.5 active:scale-95 transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#3D6B4A]" />
                <span>Call Now</span>
              </a>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Circular Image Frame with Ambient Glow & Orbit */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              
              {/* Soft Ambient Radial Glow Behind Circle */}
              <div className="absolute -inset-8 bg-gradient-to-tr from-[#4A7C59]/15 via-[#8DAA91]/10 to-transparent rounded-full blur-2xl -z-10 pointer-events-none" />

              {/* Subtle Dotted Circular Orbit Border with Gentle Rotation */}
              <div className="absolute -inset-4 sm:-inset-6 rounded-full border-2 border-dashed border-[#4A7C59]/25 pointer-events-none animate-[spin_90s_linear_infinite]" />

              {/* Circular Image Container */}
              <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] lg:w-[460px] lg:h-[460px] xl:w-[500px] xl:h-[500px] rounded-full overflow-hidden border-4 sm:border-8 border-[#F1E9D8] shadow-2xl shadow-[#4A7C59]/15 bg-[#4A7C59]/5 shrink-0">
                <img
                  src={heroReceptionImg}
                  alt="Rafah-E-Aam Medical Centre Hospital Reception"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Single Floating Info Badge */}
              <div className="absolute -bottom-2 -left-2 sm:bottom-4 sm:-left-4 bg-[#F1E9D8]/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-[#8DAA91]/40 shadow-xl shadow-[#4A7C59]/10 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#4A7C59]/10 text-[#4A7C59] flex items-center justify-center font-bold shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#4A7C59]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#4A7C59]">Expert Medical Care</p>
                  <p className="text-[11px] sm:text-xs font-medium text-[#3A362E]/80">Trusted Healthcare Facility</p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
