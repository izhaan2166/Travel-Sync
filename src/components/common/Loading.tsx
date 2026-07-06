import React from 'react';
import { Plane } from 'lucide-react';

export const Loading: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07111F] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background neon blurs */}
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-[#4F9DFF]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-[#7C6CF7]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative flex flex-col items-center gap-4 z-10">
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Pulsing ring */}
          <div className="absolute inset-0 border-2 border-[#4F9DFF]/30 rounded-full animate-ping"></div>
          {/* Spinning ring */}
          <div className="absolute inset-0 border-2 border-t-[#4F9DFF] border-r-transparent border-b-[#7C6CF7] border-l-transparent rounded-full animate-spin"></div>
          {/* Rotating plane */}
          <Plane className="w-6 h-6 text-[#4F9DFF] animate-pulse" />
        </div>
        
        <div className="text-center">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Loading Telemetry</h2>
          <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">Syncing AI modules...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
