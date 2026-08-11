import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  HeartPulse,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const { user, patientProfile, signInWithGoogle, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (type: 'home' | 'departments' | 'about' | 'contact' | 'admin') => {
    setMobileMenuOpen(false);
    if (type === 'home') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (type === 'departments') {
      navigate('/departments');
    } else if (type === 'about') {
      navigate('/about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (type === 'contact') {
      navigate('/contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (type === 'admin') {
      navigate('/admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#4A7C59]/95 backdrop-blur-[14px] border-b border-white/20 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-6">
          
          {/* Logo -> Far Left */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white text-[#4A7C59] flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 sm:w-7 sm:h-7 text-[#4A7C59]" />
            </div>
            <div>
              <div className="font-heading font-bold text-base sm:text-lg leading-tight text-white tracking-wide">
                Rafah-E-Aam
              </div>
              <div className="text-[11px] text-white/90 font-medium tracking-normal leading-none">
                Medical Centre — <span className="text-[#C9DABF] font-semibold">General & Orthopedic</span>
              </div>
            </div>
          </Link>

          {/* Navigation Links -> Middle with equal breathing room */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10 text-sm font-semibold text-white/90">
            <button 
              onClick={() => handleNavClick('home')} 
              className={`hover:text-[#C9DABF] transition-colors cursor-pointer py-1 ${
                location.pathname === '/' ? 'text-white border-b-2 border-[#C9DABF]' : ''
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('departments')} 
              className={`hover:text-[#C9DABF] transition-colors cursor-pointer py-1 ${
                location.pathname.startsWith('/departments') ? 'text-white border-b-2 border-[#C9DABF]' : ''
              }`}
            >
              Departments & Doctors
            </button>
            <button 
              onClick={() => handleNavClick('about')} 
              className={`hover:text-[#C9DABF] transition-colors cursor-pointer py-1 ${
                location.pathname.startsWith('/about') ? 'text-white border-b-2 border-[#C9DABF]' : ''
              }`}
            >
              About Us
            </button>
            <button 
              onClick={() => handleNavClick('contact')} 
              className={`hover:text-[#C9DABF] transition-colors cursor-pointer py-1 ${
                location.pathname.startsWith('/contact') ? 'text-white border-b-2 border-[#C9DABF]' : ''
              }`}
            >
              Contact
            </button>
            <button 
              onClick={() => handleNavClick('admin')} 
              className={`hover:text-[#C9DABF] transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
                location.pathname.startsWith('/admin') ? 'text-white border-b-2 border-[#C9DABF]' : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#C9DABF]" />
              <span>Admin</span>
            </button>
          </nav>

          {/* User Auth & Booking CTA -> Far Right */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-[#3D6B4A] hover:bg-[#32583d] px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-colors border border-white/20 cursor-pointer"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#4A7C59] flex items-center justify-center text-white text-xs font-bold">
                      {user.displayName?.charAt(0) || 'P'}
                    </div>
                  )}
                  <span className="max-w-[110px] truncate">
                    {patientProfile?.name || user.displayName || 'Portal'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-[#8DAA91]/30 text-[#3A362E]">
                    <Link
                      to="/portal"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-[#F1E9D8] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#4A7C59]" />
                      Patient Portal
                    </Link>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate('/portal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/40 text-white hover:bg-white hover:text-[#4A7C59] text-xs font-semibold transition-all cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Primary CTA */}
            <button
              onClick={() => {
                navigate('/departments');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#3D6B4A] hover:bg-[#32583d] active:bg-[#2a4a33] text-white px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#4A7C59] border-t border-[#3D6B4A] px-4 pt-3 pb-6 space-y-4">
          
          {/* Mobile Nav Items */}
          <nav className="flex flex-col space-y-3 text-sm font-medium text-white/90 pb-4 border-b border-white/20">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left py-1 hover:text-[#C9DABF] font-bold flex items-center justify-between"
            >
              <span>Home</span>
            </button>
            <button
              onClick={() => handleNavClick('departments')}
              className="text-left py-1 hover:text-[#C9DABF] font-bold flex items-center justify-between"
            >
              <span>Departments & Doctors</span>
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left py-1 hover:text-[#C9DABF] font-bold flex items-center justify-between"
            >
              <span>About Us</span>
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left py-1 hover:text-[#C9DABF] font-bold flex items-center justify-between"
            >
              <span>Contact</span>
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="text-left py-1 hover:text-[#C9DABF] font-bold flex items-center justify-between text-[#C9DABF]"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C9DABF]" />
                Admin Portal
              </span>
            </button>
          </nav>

          <div className="flex flex-col gap-2 pt-1">
            {user ? (
              <>
                <Link
                  to="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 bg-[#3D6B4A] text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
                >
                  <UserIcon className="w-4 h-4" />
                  Patient Portal ({patientProfile?.name || user.displayName})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="flex items-center gap-2 text-red-200 hover:text-white text-sm font-semibold py-1 px-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/portal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#3D6B4A] text-white py-2.5 rounded-xl text-sm font-semibold border border-white/20"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/departments');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full bg-[#3D6B4A] hover:bg-[#32583d] text-white py-3 rounded-xl text-sm font-bold shadow flex items-center justify-center gap-2 mt-2"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
