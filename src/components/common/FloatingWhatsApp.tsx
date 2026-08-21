import React from 'react';

interface FloatingActionsProps {
  onOpenBooking?: () => void;
}

export const FloatingWhatsApp: React.FC<FloatingActionsProps> = () => {
  const whatsappUrl = `https://wa.me/922136342011?text=${encodeURIComponent(
    "Hi, I'd like to book an appointment at Rafah-E-Aam Medical Center (رفاہ عام میڈیکل سینٹر)"
  )}`;

  return (
    <div className="fixed bottom-5 sm:bottom-6 right-4 sm:right-6 z-50 pointer-events-none">
      {/* Floating WhatsApp Button */}
      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group relative flex items-center justify-center sm:gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1caa52] text-white w-14 h-14 sm:w-auto sm:h-[50px] sm:px-5 sm:py-2.5 rounded-full shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_30px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white cursor-pointer"
        aria-label="Chat with Rafah-E-Aam Medical Centre on WhatsApp"
      >
        {/* Subtle Online Pulse Ring */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
        </span>

        {/* Real Official WhatsApp Logo Vector */}
        <svg
          className="w-7 h-7 sm:w-6 sm:h-6 shrink-0 transition-transform group-hover:scale-110"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Inner speech bubble & phone handset */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 2C8.268 2 2 8.268 2 16c0 2.73.784 5.28 2.146 7.436L2.64 29.36l6.108-1.502A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm8.076 19.866c-.336.944-1.954 1.808-2.73 1.924-.7.104-1.58.148-2.548-.16-.6-.188-1.374-.446-2.37-.878-4.168-1.808-6.902-6.02-7.112-6.298-.206-.278-1.688-2.246-1.688-4.284 0-2.038 1.066-3.042 1.444-3.456.378-.414.826-.518 1.102-.518.276 0 .552.004.792.016.254.012.592-.096.926.704.344.826 1.17 2.856 1.272 3.064.104.208.172.45.034.726-.138.276-.206.448-.412.69-.208.24-.436.536-.624.72-.208.208-.426.434-.184.848.24.414 1.074 1.77 2.304 2.864 1.582 1.41 2.912 1.848 3.324 2.054.414.208.656.174.9-.104.24-.276 1.03-1.202 1.306-1.616.276-.414.55-.344.928-.206.378.138 2.404 1.134 2.816 1.34.414.208.688.31.792.482.102.174.102 1.01-.234 1.954z"
            fill="white"
          />
        </svg>

        <span className="hidden sm:inline font-bold text-sm tracking-wide">
          WhatsApp 24/7
        </span>
      </a>
    </div>
  );
};



