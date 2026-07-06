import React from 'react';
import { FeatureGrid } from './FeatureGrid';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface Props {
  onFeatureClick: (feature: string) => void;
  onBack: () => void;
}

export function FeaturesPage({ onFeatureClick, onBack }: Props) {
  return (
    <div className="min-h-screen animate-mesh flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#4F9DFF]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#7C6CF7]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1280px] w-full space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition duration-200 group mb-4"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4F9DFF]/10 border border-[#4F9DFF]/20 text-xs font-semibold text-[#4F9DFF] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Travel Intelligence Suite
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient-primary">
            Explore Capabilities
          </h1>
          <p className="text-base text-slate-400 max-w-xl mx-auto">
            Select one of the modules below to start building, analyzing, tracking or mapping your next journey.
          </p>
        </div>

        <div className="w-full max-w-[1024px] mx-auto">
          <FeatureGrid onFeatureClick={onFeatureClick} />
        </div>
      </div>
    </div>
  );
}