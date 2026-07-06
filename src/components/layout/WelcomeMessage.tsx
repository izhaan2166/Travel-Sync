import React from 'react';
import { Compass } from 'lucide-react';

export const WelcomeMessage: React.FC = React.memo(() => {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-6 py-10 px-8 bg-white border border-slate-200 rounded-[20px] relative overflow-hidden shadow-sm">
      <div className="flex justify-center mb-2">
        <div className="w-10 h-10 rounded-xl bg-[#0F3D91]/5 border border-[#0F3D91]/10 flex items-center justify-center text-[#0F3D91]">
          <Compass className="w-5 h-5" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-[#0F3D91] tracking-tight">
        Our Travel Philosophy
      </h2>
      
      <div className="space-y-4 text-slate-600 leading-relaxed text-xs sm:text-sm font-medium">
        <p>
          At TravelSync, we are dedicated to delivering exceptional, modular travel telemetry solutions 
          that render your journey seamless, structured, and unforgettable.
        </p>
        <p>
          Whether you are managing a corporate relocation, a tropical vacation, or an offline exploration, 
          our modules assist in compiling budget spreadsheets, plotting TomTom mapping vectors, and tracking active flight gate shifts.
        </p>
        <p>
          Our neural recommendation systems adapt to your custom interests, outputting real-time forecast 
          updates and security alerts to keep you completely optimized.
        </p>
      </div>
    </div>
  );
});

WelcomeMessage.displayName = 'WelcomeMessage';
