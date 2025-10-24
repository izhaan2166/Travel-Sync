import React, { useState } from 'react';
import { TravelItem } from '../types';
import { Plus } from 'lucide-react';

interface Props {
  onAdd: (item: Omit<TravelItem, 'id'>) => void;
}

export function AddItemForm({ onAdd }: Props) {
  const [formData, setFormData] = useState({
    type: 'flight',
    title: '',
    startDate: '',
    endDate: '',
    location: '',
    status: 'pending',
    cost: 0,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      type: 'flight',
      title: '',
      startDate: '',
      endDate: '',
      location: '',
      status: 'pending',
      cost: 0,
      notes: ''
    });
  };

  const inputClasses = "w-full bg-black border border-green-500/30 rounded-lg p-2 text-gray-300 focus:border-green-400 focus:ring-1 focus:ring-green-400 placeholder-gray-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as TravelItem['type'] })}
            className={inputClasses}
          >
            <option value="flight">Flight</option>
            <option value="hotel">Hotel</option>
            <option value="activity">Activity</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Cost</label>
          <input
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
            className={inputClasses}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className={inputClasses}
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-400 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all neon-card"
      >
        <Plus className="w-4 h-4" />
        Add Item
      </button>
    </form>
  );
}