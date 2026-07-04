import React, { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center p-8 relative">
      {/* Hamburger Menu */}
      <button
        className="absolute top-4 right-4 text-slate-300 bg-[#0f172a] border border-slate-800 p-3 rounded-full hover:bg-slate-800 hover:text-white transition-all duration-300 shadow-md"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-xl p-4 z-50">
          <button
            className="block px-4 py-2 text-left w-full hover:bg-slate-800 rounded-lg transition"
            onClick={handleLoginClick}
          >
            Login
          </button>
        </div>
      )}

      <div className="max-w-4xl w-full space-y-12">
        <WelcomeHero />
        <WelcomeMessage />
        <button
          onClick={onGetStarted}
          className="group relative px-8 py-4 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-xl font-bold text-xl transition-all duration-300 hover:scale-105 border border-sky-500/30 hover:border-sky-400 hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] mx-auto block"
        >
          Get Started
          <ArrowRight className="inline-block ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
}
