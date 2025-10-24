import React from 'react';
import { FeatureGrid } from './FeatureGrid';
import { BackButton } from './BackButton';

interface Props {
  onFeatureClick: (feature: string) => void;
  onBack: () => void;
}

export function FeaturesPage({ onFeatureClick, onBack }: Props) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-12">
        <h1 className="text-4xl font-bold text-center text-green-400">Features</h1>
        <FeatureGrid onFeatureClick={onFeatureClick} />
        <div className="flex justify-center">
          <button
            onClick={onBack}
            className="px-8 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-bold text-xl transition-all duration-300 hover:scale-105 border border-red-500/30 hover:border-red-400 hover:shadow-[0_0_10px_#ef4444,0_0_20px_#ef4444,0_0_30px_#ef4444]"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}