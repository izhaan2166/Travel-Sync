import React, { useState } from 'react';
import { ArrowRight, Menu, X, Palmtree, MapPin } from 'lucide-react';
import { WelcomeHero } from './WelcomeHero';
import { WelcomeMessage } from './WelcomeMessage';
import { LoginPage } from './LoginPage'; // Assume LoginPage is defined elsewhere

interface Props {
  onGetStarted: () => void;
}

export function WelcomePage({ onGetStarted }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navigateToLogin, setNavigateToLogin] = useState(false);

  const handleLoginClick = () => {
    setNavigateToLogin(true);
  };

  if (navigateToLogin) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen welcome-bg flex flex-col items-center justify-center p-4 sm:p-8 relative">
      {/* Top Banner Tagline */}
      <div className="absolute top-4 left-4 hidden sm:flex items-center gap-2 text-xs font-semibold tracking-widest text-sky-400 uppercase bg-[#0f172a]/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800">
        <Palmtree className="w-3.5 h-3.5 text-sky-400" />
        Explore • Experience • Escape
      </div>

      {/* Hamburger Menu */}
      <button
        className="absolute top-4 right-4 text-slate-300 bg-[#0f172a]/70 backdrop-blur-md border border-slate-850 p-3 rounded-full hover:bg-slate-800 hover:text-white transition-all duration-300 shadow-md"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 text-white rounded-xl shadow-xl p-4 z-50">
          <button
            className="block px-4 py-2 text-left w-full hover:bg-slate-800 rounded-lg transition"
            onClick={handleLoginClick}
          >
            Login
          </button>
        </div>
      )}

      {/* Glassmorphic Central Box */}
      <div className="max-w-4xl w-full bg-[#0a0d16]/55 backdrop-blur-xl border border-slate-850 p-6 sm:p-12 rounded-3xl shadow-2xl space-y-8 sm:space-y-12 transition-all duration-500 hover:shadow-sky-500/5 hover:border-slate-800">
        <WelcomeHero />
        <WelcomeMessage />
        
        <button
          onClick={onGetStarted}
          className="group relative px-10 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl font-bold text-xl transition-all duration-300 hover:scale-[1.03] shadow-[0_0_20px_rgba(14,165,233,0.35)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] mx-auto block flex items-center gap-2"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>

      {/* Bottom organic element location indicator */}
      <div className="absolute bottom-4 flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold tracking-wider uppercase bg-slate-900/30 backdrop-blur-sm px-3 py-1 rounded-full">
        <MapPin className="w-3 h-3 text-sky-500/50" />
        Bora Bora Island Landscape
      </div>
    </div>
  );
}
