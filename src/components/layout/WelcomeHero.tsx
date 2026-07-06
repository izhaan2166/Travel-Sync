import React, { useState, useEffect } from 'react';
import { ArrowRight, MapPin, Sun, CloudRain, CloudSun, Cloud, Wind, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onGetStarted: () => void;
}

export const WelcomeHero: React.FC<Props> = React.memo(({ onGetStarted }) => {
  const [time, setTime] = useState(new Date());
  const [locIndex, setLocIndex] = useState(0);

  const locations = [
    { city: 'Tokyo', country: 'Japan', temp: '22°C', weather: 'Mostly Sunny', icon: CloudSun },
    { city: 'Paris', country: 'France', temp: '19°C', weather: 'Clear Sky', icon: Sun },
    { city: 'New York', country: 'USA', temp: '24°C', weather: 'Partly Cloudy', icon: Cloud },
    { city: 'London', country: 'UK', temp: '16°C', weather: 'Light Rain', icon: CloudRain },
    { city: 'Sydney', country: 'Australia', temp: '18°C', weather: 'Windy', icon: Wind }
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const locTimer = setInterval(() => {
      setLocIndex((prev) => (prev + 1) % locations.length);
    }, 6000);
    return () => {
      clearInterval(timer);
      clearInterval(locTimer);
    };
  }, []);

  const currentLoc = locations[locIndex];
  const WeatherIcon = currentLoc.icon;

  return (
    <div className="space-y-8 text-left max-w-xl">
      {/* Compact Location & Weather Indicator */}
      <div className="inline-flex flex-wrap items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white border border-slate-200 text-[11px] text-slate-500 font-mono shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl text-slate-700 font-bold">
          <MapPin className="w-3.5 h-3.5 text-[#00A896]" />
          <AnimatePresence mode="wait">
            <motion.span
              key={currentLoc.city}
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {currentLoc.city}
            </motion.span>
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-1.5 border-r border-slate-200/80 pr-3 py-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLoc.city}
              className="flex items-center gap-1.5 text-slate-500 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <WeatherIcon className="w-3.5 h-3.5 text-[#00A896]" />
              <span>{currentLoc.temp} • {currentLoc.weather}</span>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 font-bold font-mono">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A896]/10 border border-[#00A896]/15 text-[10px] font-bold text-[#00A896] tracking-wider uppercase font-mono">
          Travel Management
        </div>

        <h1 className="text-4xl sm:text-5.5xl font-black tracking-tight text-[#0F3D91] leading-[1.12]">
          Your Entire Journey <br />
          <span className="text-[#00A896]">In Perfect Sync.</span>
        </h1>
      </div>

      <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
        Plan detailed itineraries, discover local destinations, manage travel expenses, and receive real-time updates—all coordinated through intelligent suggestions.
      </p>

      <div className="flex flex-wrap gap-3 pt-2">
        <button 
          onClick={onGetStarted}
          className="btn-primary px-8 py-3.5 text-xs uppercase tracking-wider flex items-center gap-2 group shadow-sm hover:scale-[1.01]"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
        <a 
          href="#features"
          className="btn-secondary px-8 py-3.5 text-xs uppercase tracking-wider flex items-center justify-center shadow-sm"
        >
          Explore Features
        </a>
      </div>

      {/* Statistics */}
      <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-6">
        <div className="space-y-1">
          <p className="text-2xl font-black text-[#0F3D91]">20K+</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none font-mono">Trips Planned</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-black text-[#00A896]">150+</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none font-mono">Countries</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-black text-[#0F3D91]">98%</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none font-mono">Satisfaction</p>
        </div>
      </div>
    </div>
  );
});

WelcomeHero.displayName = 'WelcomeHero';
