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
    <section id="home" className="relative bg-[#F5F1E8] pt-[clamp(5px,4vw,20px)] pb-[clamp(45px,5vw,70px)] overflow-hidden">
      {/* Subtle Ambient Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE: Minimal, Elegant Typography & CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-[600px] space-y-5 sm:space-y-6 text-left mx-auto lg:mx-0"
          >
            {/* Eyebrow */}
            <div>
              <span className="inline-block text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#0B6B4E] bg-[#0B6B4E]/10 px-4 py-1.5 rounded-full border border-[#0B6B4E]/15">
                GENERAL & ORTHOPAEDIC CARE
              </span>
            </div>

          {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-extrabold text-[#032d20] leading-[1.18] tracking-tight max-w-[520px]">
              Trusted care for{' '}
             <span
                className="text-amber-600 font-black relative inline-block text-4xl sm:text-5xl lg:text-6xl"
                style={{ fontFamily: '"Segoe Script", "Brush Script MT", "Comic Sans MS", cursive' }}
              >
                every
                
              </span>{' '}
              stage of life
            </h1>


            {/* Short Description */}
            <p className="text-emerald-950/75 text-base sm:text-lg font-medium leading-relaxed max-w-[500px]">
              Compassionate healthcare, modern diagnostics, and expert medical care for you and your family.
            </p>

            {/* Action Buttons */}
            <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
              <button
                onClick={handleBookClick}
                className="bg-[#D64545] hover:bg-[#c23737] text-white px-7 py-3.5 rounded-full text-sm sm:text-base font-bold shadow-lg shadow-[#D64545]/20 hover:scale-[1.02] active:scale-95 transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Book an Appointment</span>
              </button>

              <a
                href="tel:+922136342011"
                className="bg-white hover:bg-emerald-50/80 text-[#0B6B4E] border border-emerald-900/15 px-6 py-3.5 rounded-full text-sm sm:text-base font-bold shadow-xs hover:scale-[1.02] active:scale-95 transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#D64545]" />
                <span>Call Now</span>
              </a>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Large Circular Image Frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              
              {/* Subtle Decorative Dotted/Dashed Outer Ring */}
              <div className="absolute -inset-4 sm:-inset-6 rounded-full border-2 border-dashed border-[#0B6B4E]/20 pointer-events-none" />

              {/* Circular Image Container */}
              <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[430px] lg:h-[430px] xl:w-[470px] xl:h-[470px] rounded-full overflow-hidden border-4 sm:border-8 border-white shadow-2xl shadow-emerald-950/15 bg-emerald-900/5 shrink-0">
                <img
                  src={heroReceptionImg}
                  alt="Rafah-E-Aam Medical Centre Hospital Reception"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Single Floating Info Badge */}
              <div className="absolute -bottom-2 -left-2 sm:bottom-4 sm:-left-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-emerald-900/10 shadow-xl shadow-emerald-950/10 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0B6B4E] flex items-center justify-center font-bold shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#0B6B4E]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#032d20]">Expert Medical Care</p>
                  <p className="text-[11px] sm:text-xs font-medium text-emerald-800/70">Trusted Healthcare Facility</p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}