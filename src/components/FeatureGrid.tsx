import React from 'react';
import { Plane, Map, Calendar, Clock, Shield, Share2 } from 'lucide-react';

interface Props {
  onFeatureClick: (feature: string) => void;
}

const features = [
  { 
    icon: Plane, 
    title: 'Smart Booking', 
    desc: 'Real-time flight updates and alternatives',
    id: 'smart-booking'
  },
  { 
    icon: Map, 
    title: 'Interactive Maps', 
    desc: 'Visualize your entire journey',
    id: 'interactive-maps'
  },
  { 
    icon: Calendar, 
    title: 'Dynamic Planning', 
    desc: 'Adaptive scheduling with AI assistance',
    id: 'dynamic-planning'
  },
  { 
    icon: Clock, 
    title: 'Real-Time Updates', 
    desc: 'Stay informed about changes and delays',
    id: 'real-time-updates'
  },
  { 
    icon: Shield, 
    title: 'Secure Storage', 
    desc: 'Keep your travel documents safe',
    id: 'secure-storage'
  },
  { 
    icon: Share2, 
    title: 'Easy Sharing', 
    desc: 'Collaborate with co-travelers',
    id: 'easy-sharing'
  }
];

export function FeatureGrid({ onFeatureClick }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {features.map(({ icon: Icon, title, desc, id }) => (
        <div
          key={title}
          className="neon-card bg-black/50 p-6 rounded-xl backdrop-blur-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => onFeatureClick(id)}
        >
          <Icon className="w-8 h-8 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-400 mb-2">{title}</h3>
          <p className="text-gray-400">{desc}</p>
        </div>
      ))}
    </div>
  );
}