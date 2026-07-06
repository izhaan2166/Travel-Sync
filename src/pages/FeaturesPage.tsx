import React from 'react';
import { Sparkles } from 'lucide-react';
import { FeatureGrid } from '../components/cards/FeatureGrid';
import { Navigation } from '../components/navigation/Navigation';

interface Props {
  onFeatureClick: (feature: string) => void;
  onBack: () => void;
}

export const FeaturesPage: React.FC<Props> = React.memo(({ onFeatureClick, onBack }) => {
  return (
    <div className="min-h-screen pt-24 text-slate-800 relative overflow-hidden flex flex-col justify-between bg-[#FAFAFA]">
      
      {/* Navigation Header */}
      <Navigation onBack={onBack} title="Intelligence Suite" />

      {/* Main Content inside 1280px Container */}
      <div className="max-w-[1280px] w-full mx-auto px-6 sm:px-12 py-10 relative z-10 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F3D91]/5 border border-[#0F3D91]/10 text-xs font-semibold text-[#0F3D91] uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            Travel Intelligence Suite
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#0F3D91] leading-tight">
            Explore Capabilities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-xl mx-auto leading-relaxed">
            Select one of the modules below to start building, analyzing, tracking or mapping your next journey.
          </p>
        </div>

        <div className="w-full max-w-[1024px] mx-auto">
          <FeatureGrid onFeatureClick={onFeatureClick} />
        </div>
      </div>
    </div>
  );
});

FeaturesPage.displayName = 'FeaturesPage';
