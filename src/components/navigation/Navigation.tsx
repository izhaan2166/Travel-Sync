import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Menu, X, ArrowLeft, User } from 'lucide-react';

interface Props {
  onBack?: () => void;
  title?: string;
  onLoginClick?: () => void;
}

export const Navigation: React.FC<Props> = React.memo(({ onBack, title, onLoginClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Planner', path: '/dynamic-planning' },
    { name: 'Booking', path: '/smart-booking' },
    { name: 'Dashboard', path: '/features' },
    { name: 'Contact', path: '#footer' }
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    if (path.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(path.slice(1));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(path.slice(1));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeItem = navItems.find(item => {
    if (item.path === '/' && location.pathname === '/') return true;
    if (item.path !== '/' && !item.path.startsWith('#') && location.pathname.startsWith(item.path)) return true;
    return false;
  }) || navItems[0];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 border-b border-slate-200/80 shadow-sm py-3 backdrop-blur-md' 
          : 'bg-transparent py-5 border-b border-transparent'
      }`}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-12 flex items-center justify-between">
          {/* Left Side: Logo & Back Button if applicable */}
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="group p-2 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/60 flex items-center justify-center"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4 text-slate-650 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            )}
            
            <div 
              onClick={handleLogoClick}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0F3D91] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-4 h-4 text-white transition-transform duration-300 rotate-45 group-hover:rotate-0"
                >
                  <path d="M21 16V14L13 9V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9L2 14v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5L21 16z" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-tight text-[#0F3D91]">
                Travel<span className="font-light text-[#00A896]">Sync</span>
              </span>
            </div>

            {title && (
              <span className="hidden md:inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#0F3D91]/5 text-[#0F3D91] border border-[#0F3D91]/10 uppercase tracking-widest ml-2 font-mono">
                {title}
              </span>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = activeItem.name === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.path)}
                  className={`relative py-2 text-xs font-bold tracking-wider uppercase transition duration-200 ${
                    isActive ? 'text-[#0F3D91]' : 'text-slate-500 hover:text-[#0F3D91]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00A896]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Side: Account Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button 
              onClick={onLoginClick || (() => navigate('/login'))}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-wider text-slate-600 hover:text-[#0F3D91] transition duration-200 uppercase bg-white border border-slate-200 hover:border-slate-300 rounded-xl"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
            <button 
              onClick={() => navigate('/features')}
              className="btn-primary px-5 py-2 text-xs uppercase tracking-wider shadow-sm hover:scale-[1.01] transition duration-200"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            {onLoginClick && (
              <button 
                onClick={onLoginClick}
                className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600"
              >
                <User className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[64px] z-40 p-6 bg-white border-b border-slate-200 shadow-xl flex flex-col gap-6 lg:hidden"
          >
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const isActive = activeItem.name === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                      isActive 
                        ? 'bg-slate-50 text-[#0F3D91] border-l-4 border-[#00A896]' 
                        : 'text-slate-600 hover:bg-slate-55 hover:text-[#0F3D91]'
                    }`}
                  >
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="h-px bg-slate-100 my-1" />
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 rounded-xl text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/features');
                }}
                className="flex-1 btn-primary py-3 text-xs uppercase tracking-wider text-center"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

Navigation.displayName = 'Navigation';
export default Navigation;
