import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export function BackButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="group absolute top-4 left-4 px-4 py-2 bg-black/50 rounded-lg font-bold transition-all duration-300 hover:scale-105 neon-card-red flex items-center gap-2"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      <span className="group-hover:neon-text-red">Back</span>
    </button>
  );
}