import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
  title: string;
}

export function Navigation({ onBack, title }: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-lg z-50">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="group p-2 hover:bg-green-500/10 rounded-lg transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-green-400 group-hover:-translate-x-1 transition-transform" />
        </button>
        <h1 className="text-xl font-bold text-green-400">{title}</h1>
      </div>
    </div>
  );
}