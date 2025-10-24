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
      case 'confirmed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'delayed': return 'neon-text-red';
      case 'cancelled': return 'neon-text-red';
      default: return 'text-gray-400';
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
        <div className="text-center py-8 text-gray-400">
          No items in your itinerary yet. Add your first travel item!
        </div>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            onClick={() => onEditItem(item)}
            className={`${getCardStyle(item.status)} bg-black/50 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-5 transition-all cursor-pointer group`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-green-400 group-hover:text-green-300">
                {item.title}
              </h3>
              <span className={`capitalize ${getStatusStyle(item.status)}`}>
                {item.status}
              </span>
            </div>
            
            <div className="mt-2 space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-400" />
                <span>{new Date(item.startDate).toLocaleDateString()}</span>
                {item.endDate && (
                  <>
                    <span>-</span>
                    <span>{new Date(item.endDate).toLocaleDateString()}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span>${item.cost}</span>
              </div>
              {item.notes && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">{item.notes}</span>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}