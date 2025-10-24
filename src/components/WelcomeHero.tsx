import React from 'react';
import { Clock } from './Clock';
import { Plane } from 'lucide-react';

export function WelcomeHero() {
  return (
    <div className="space-y-6 mb-12">
      <Clock />
      <div className="space-y-4">
        <h1 className="text-6xl font-bold flex items-center justify-center gap-3">
          <span className="text-green-400">Travel</span>
          <span className="text-white">Sync</span>
          <Plane className="w-12 h-12 text-green-400 animate-pulse" />
        </h1>
        <p className="text-xl text-gray-400">Your intelligent travel companion</p>
      </div>
    </div>
  );
}