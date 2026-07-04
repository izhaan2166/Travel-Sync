import React from 'react';
import { Clock } from './Clock';
import { Plane } from 'lucide-react';

export function WelcomeHero() {
  return (
    <div className="space-y-6 mb-12">
      <Clock />
      <div className="space-y-4 text-center">
        <h1 className="text-6xl font-extrabold flex items-center justify-center gap-3">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Travel</span>
          <span className="text-white font-light">Sync</span>
          <Plane className="w-12 h-12 text-sky-400 animate-pulse" />
        </h1>
        <p className="text-xl text-slate-400 font-medium tracking-wide">Your premium, intelligent travel companion</p>
      </div>
    </div>
  );
}