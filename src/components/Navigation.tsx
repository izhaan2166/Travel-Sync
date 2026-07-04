import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
  title: string;
}

export function Navigation({ onBack, title }: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-[#0f172a]/85 backdrop-blur-md border-b border-slate-800/80 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="group p-2 hover:bg-sky-500/10 rounded-lg transition-all border border-transparent hover:border-sky-500/20"
        >
          <ArrowLeft className="w-6 h-6 text-sky-400 group-hover:-translate-x-1 transition-transform" />
        </button>
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">{title}</h1>
      </div>
    </div>
  );
}