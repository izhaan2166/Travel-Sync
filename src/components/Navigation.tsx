import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
  title: string;
}

export function Navigation({ onBack, title }: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 glass-navbar z-50 shadow-lg shadow-black/25 py-3">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-12 flex items-center gap-4">
        <button
          onClick={onBack}
          className="group p-2 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10"
        >
          <ArrowLeft className="w-5 h-5 text-slate-300 group-hover:-translate-x-1 transition-transform" />
        </button>
        <h1 className="text-lg font-extrabold text-gradient-primary uppercase tracking-wider">{title}</h1>
      </div>
    </div>
  );
}