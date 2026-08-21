import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Phone, ShieldCheck } from 'lucide-react';
import heroReceptionImg from '../../assets/images/receptionist_1787326562967.jpg';

interface HeroProps {
  onOpenBooking?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  const navigate = useNavigate();

  const handleBookClick = () => {
    navigate('/departments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative bg-white pt-[clamp(1px,3vw,5px)] pb-[clamp(55px,6vw,70px)] overflow-hidden">
      {/* Subtle Ambient Background Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#22A25A]/5 rounded-full pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#EFF4EC]/60 rounded-full pointer-events-none -z-0" />

      <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-12 xl:gap-14 items-center">
          
          {/* LEFT SIDE: Typography & CTAs */}
          <div className="max-w-[560px] space-y-5 sm:space-y-6 text-left mx-auto lg:mx-0">
            {/* Eyebrow */}
            <div>
              <span className="inline-block text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#22A25A] bg-[#EFF4EC] pl-[12px] pr-[5px] py-[2px] rounded-full border border-[#E4E9E5]">
                GENERAL & ORTHOPAEDIC CARE
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[clamp(39px,11.5vw,46px)] sm:text-4xl md:text-5xl lg:text-[clamp(40px,4.5vw,60px)] font-extrabold text-[#182334] leading-[1.02] sm:leading-[1.15] tracking-tight max-w-[540px]">
              Trusted care for{' '}
              <span className="text-[#F28C45] font-black relative inline-block text-[clamp(43px,12.5vw,52px)] sm:text-5xl lg:text-6xl"
                style={{ fontFamily: '"Segoe Script", "Brush Script MT", "Comic Sans MS", cursive' }}
              >
                every
              </span>{' '}
              stage of life
            </h1>

            {/* Short Description */}
            <p className="text-[#5F6875] text-[15px] sm:text-lg font-normal sm:font-medium leading-[1.5] sm:leading-relaxed max-w-[320px] sm:max-w-[500px]">
              Compassionate healthcare, modern diagnostics, and expert medical care for you and your family.
            </p>

            {/* Action Buttons */}
            <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
              <button
                onClick={handleBookClick}
                className="bg-[#22A25A] hover:bg-[#168A4A] text-white px-7 py-3.5 rounded-full text-sm sm:text-base font-bold shadow-md shadow-[#22A25A]/20 hover:-translate-y-0.5 active:scale-95 transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span>Consult a Doctor</span>
              </button>

              <a
                href="tel:+922136342011"
                className="bg-white hover:bg-[#F28C45]/5 text-[#F28C45] border-2 border-[#F28C45] px-6 py-3.5 rounded-full text-sm sm:text-base font-bold shadow-xs hover:-translate-y-0.5 active:scale-95 transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#F28C45]" />
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: Circular Image Frame with Ambient Glow & Orbit */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              
              {/* Subtle Dotted Circular Orbit Border */}
              <div className="absolute -inset-4 sm:-inset-6 rounded-full border-2 border-dashed border-[#22A25A]/20 pointer-events-none" />

              {/* Circular Image Container */}
              <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] lg:w-[460px] lg:h-[460px] xl:w-[500px] xl:h-[500px] rounded-full overflow-hidden border-4 sm:border-8 border-white shadow-lg bg-white shrink-0">
                <img
                  src={heroReceptionImg}
                  alt="Rafah-E-Aam Medical Centre Hospital Reception"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="async"
                  width="500"
                  height="500"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Single Floating Info Badge */}
              <div className="absolute -bottom-2 -left-2 sm:bottom-4 sm:-left-4 bg-white px-4 py-3 rounded-2xl border border-[#E4E9E5] shadow-lg shadow-gray-200/60 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#EFF4EC] text-[#22A25A] flex items-center justify-center font-bold shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#22A25A]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#182334]">Expert Medical Care</p>
                  <p className="text-[11px] sm:text-xs font-medium text-[#5F6875]">Trusted Healthcare Facility</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
