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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative">
      {/* Hamburger Menu */}
      <button
        className="absolute top-4 right-4 text-white bg-black p-3 rounded-full hover:bg-white hover:text-black transition-all duration-300"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-gray-800 text-white rounded-lg shadow-lg p-4">
          <button
            className="block px-4 py-2 text-left w-full hover:bg-gray-700 rounded-md"
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
          className="group relative px-8 py-4 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg font-bold text-xl transition-all duration-300 hover:scale-105 neon-card mx-auto block"
        >
          Get Started
          <ArrowRight className="inline-block ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
}
