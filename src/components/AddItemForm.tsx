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

  const inputClasses = "w-full bg-[#070b13] border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-700 outline-none transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Type</label>
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
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">End Date</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Cost</label>
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
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className={inputClasses}
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-200 border border-sky-500/20 hover:border-sky-500/40 hover:shadow-md"
      >
        <Plus className="w-4 h-4" />
        Add Item
      </button>
    </form>
  );
}