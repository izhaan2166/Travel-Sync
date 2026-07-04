import React from 'react';
import { Calendar, MapPin, Clock, AlertCircle } from 'lucide-react';
import { TravelItem } from '../types';

interface Props {
  items: TravelItem[];
  onEditItem: (item: TravelItem) => void;
}

export function ItineraryList({ items, onEditItem }: Props) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-sky-400';
      case 'pending': return 'text-amber-400';
      case 'delayed': return 'text-red-400';
      case 'cancelled': return 'text-red-500';
      default: return 'text-slate-400';
    }
  };

  const getCardStyle = (status: string) => {
    switch (status) {
      case 'delayed':
      case 'cancelled':
        return 'neon-card-red';
      default:
        return 'neon-card';
    }
  };

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="text-center py-8 text-slate-500 italic text-sm">
          No items in your itinerary yet. Add your first travel item!
        </div>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            onClick={() => onEditItem(item)}
            className={`${getCardStyle(item.status)} bg-[#0f172a]/40 hover:bg-[#0f172a]/60 backdrop-blur-md rounded-2xl p-5 transition-all cursor-pointer border border-slate-800 hover:border-sky-500/30 group`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 group-hover:text-sky-300 transition">
                {item.title}
              </h3>
              <span className={`text-xs font-bold uppercase tracking-wider ${getStatusStyle(item.status)}`}>
                {item.status}
              </span>
            </div>
            
            <div className="mt-3 space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>{new Date(item.startDate).toLocaleDateString()}</span>
                {item.endDate && (
                  <>
                    <span>-</span>
                    <span>{new Date(item.endDate).toLocaleDateString()}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <span className="font-semibold text-slate-200">${item.cost}</span>
              </div>
              {item.notes && (
                <div className="flex items-start gap-2 bg-[#070b13]/40 p-2 border border-slate-850 rounded-lg mt-2 text-xs">
                  <AlertCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item.notes}</span>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}