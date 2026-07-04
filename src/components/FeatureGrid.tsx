import React from 'react';
import { Plane, Map, Calendar, Clock, Shield, Share2 } from 'lucide-react';

interface Props {
  onFeatureClick: (feature: string) => void;
}

const features = [
  { 
    icon: Plane, 
    title: 'Smart Booking', 
    desc: 'Real-time flight search & direct Google Flights comparison',
    id: 'smart-booking'
  },
  { 
    icon: Map, 
    title: 'Interactive Maps', 
    desc: 'Visualize your entire journey and track weather routes',
    id: 'interactive-maps'
  },
  { 
    icon: Calendar, 
    title: 'Dynamic Planning', 
    desc: 'Adaptive scheduling with intelligent ML recommendations',
    id: 'dynamic-planning'
  },
  { 
    icon: Clock, 
    title: 'Real-Time Updates', 
    desc: 'Stay informed about changes and delays during the trip',
    id: 'real-time-updates'
  },
  { 
    icon: Shield, 
    title: 'Secure Storage', 
    desc: 'Keep your digital travel documents safe and encrypted',
    id: 'secure-storage'
  },
  { 
    icon: Share2, 
    title: 'Easy Sharing', 
    desc: 'Collaborate and share itineraries with co-travelers',
    id: 'easy-sharing'
  }
];

export function FeatureGrid({ onFeatureClick }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {features.map(({ icon: Icon, title, desc, id }) => (
        <div
          key={title}
          className="neon-card bg-[#0f172a]/50 p-6 rounded-2xl border border-slate-800 cursor-pointer hover:scale-[1.03] hover:border-sky-500/30 transition-all duration-300 shadow-md flex flex-col items-center text-center"
          onClick={() => onFeatureClick(id)}
        >
          <Icon className="w-8 h-8 text-sky-400 mb-4" />
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 mb-2">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  );
}