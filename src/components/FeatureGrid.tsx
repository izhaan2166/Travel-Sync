import React from 'react';
import { Plane, Map, Calendar, Clock, Shield, Share2, ChevronRight } from 'lucide-react';

interface Props {
  onFeatureClick: (feature: string) => void;
}

const features = [
  { 
    icon: Plane, 
    title: 'Smart Booking', 
    desc: 'Real-time flight search & direct Google Flights comparison',
    id: 'smart-booking',
    color: 'primary'
  },
  { 
    icon: Map, 
    title: 'Interactive Maps', 
    desc: 'Visualize your entire journey and track weather routes',
    id: 'interactive-maps',
    color: 'teal'
  },
  { 
    icon: Calendar, 
    title: 'Dynamic Planning', 
    desc: 'Adaptive scheduling with intelligent ML recommendations',
    id: 'dynamic-planning',
    color: 'purple'
  },
  { 
    icon: Clock, 
    title: 'Real-Time Updates', 
    desc: 'Stay informed about changes and delays during the trip',
    id: 'real-time-updates',
    color: 'primary'
  },
  { 
    icon: Shield, 
    title: 'Secure Storage', 
    desc: 'Keep your digital travel documents safe and encrypted',
    id: 'secure-storage',
    color: 'purple'
  },
  { 
    icon: Share2, 
    title: 'Easy Sharing', 
    desc: 'Collaborate and share itineraries with co-travelers',
    id: 'easy-sharing',
    color: 'teal'
  }
];

export function FeatureGrid({ onFeatureClick }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {features.map(({ icon: Icon, title, desc, id, color }) => (
        <div
          key={title}
          className={`glass-card p-6 rounded-2xl cursor-pointer select-none text-left flex flex-col justify-between group ${
            color === 'purple' ? 'glass-card-purple' : color === 'teal' ? 'glass-card-teal' : ''
          }`}
          onClick={() => onFeatureClick(id)}
        >
          <div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition duration-300 border ${
              color === 'purple' ? 'bg-[#7C6CF7]/10 border-[#7C6CF7]/20 text-[#7C6CF7] group-hover:bg-[#7C6CF7]/20' : 
              color === 'teal' ? 'bg-[#5EEAD4]/10 border-[#5EEAD4]/20 text-[#5EEAD4] group-hover:bg-[#5EEAD4]/20' : 
              'bg-[#4F9DFF]/10 border-[#4F9DFF]/20 text-[#4F9DFF] group-hover:bg-[#4F9DFF]/20'
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-[#4F9DFF] transition duration-200 flex items-center gap-1">
              {title}
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mt-2">{desc}</p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span>Launch Tool</span>
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>
      ))}
    </div>
  );
}