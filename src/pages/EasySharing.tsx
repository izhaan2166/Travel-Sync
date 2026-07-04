import React from 'react';
import { Navigation } from '../components/Navigation';
import { Share2, Users, Link, Settings } from 'lucide-react';

export function EasySharing({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0b0f19] pt-16 text-slate-100">
      <Navigation onBack={onBack} title="Easy Sharing" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="neon-card bg-[#0f172a]/60 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-2xl font-bold text-sky-400 mb-4 flex items-center gap-2">
                <Share2 className="w-6 h-6" />
                Share Itinerary
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter email addresses..."
                    className="w-full bg-[#070b13] border border-slate-800 focus:border-sky-500 rounded-xl p-3 text-slate-200 outline-none transition"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 px-4 py-1 rounded-lg border border-sky-500/20 transition">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['john@example.com', 'sarah@example.com'].map(email => (
                    <div key={email} className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-3 py-1 rounded-full flex items-center gap-2 text-xs">
                      <span>{email}</span>
                      <button className="text-xs hover:text-red-400">×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="neon-card bg-[#0f172a]/60 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-sky-400 mb-4">Quick Share</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 p-3 border border-slate-800 rounded-xl hover:bg-sky-500/5 hover:border-sky-500/20 text-sm text-slate-300 transition">
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>Co-travelers</span>
                </button>
                <button className="flex items-center justify-center gap-2 p-3 border border-slate-800 rounded-xl hover:bg-sky-500/5 hover:border-sky-500/20 text-sm text-slate-300 transition">
                  <Link className="w-4 h-4 text-sky-400" />
                  <span>Get Link</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="neon-card bg-[#0f172a]/60 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-sky-400 mb-4">Shared With</h3>
              <div className="space-y-3">
                {[
                  { email: 'john@example.com', role: 'Editor' },
                  { email: 'sarah@example.com', role: 'Viewer' }
                ].map(user => (
                  <div key={user.email} className="flex items-center justify-between p-3 border border-slate-800 rounded-xl bg-[#070b13]/40">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                        <span className="text-sky-400 font-bold text-xs">{user.email[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-200">{user.email}</p>
                        <p className="text-xs text-sky-400 mt-0.5">{user.role}</p>
                      </div>
                    </div>
                    <button className="text-xs text-slate-500 hover:text-red-400 transition">Remove</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="neon-card bg-[#0f172a]/60 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-sky-400 mb-4">Sharing Settings</h3>
              <div className="space-y-4">
                {[
                  'Allow editing',
                  'Allow comments',
                  'Share notifications'
                ].map(setting => (
                  <div key={setting} className="flex items-center justify-between text-sm text-slate-300">
                    <span>{setting}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-sky-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-950"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}