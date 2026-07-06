import React from 'react';
import { Navigation } from '../components/Navigation';
import { Share2, Users, Link, Settings } from 'lucide-react';

export function EasySharing({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen animate-mesh pt-24 text-slate-100 relative overflow-hidden">
      <Navigation onBack={onBack} title="Easy Journey Sharing" />

      {/* Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#4F9DFF]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#7C6CF7]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          <div className="space-y-8">
            {/* Share Itinerary Card */}
            <div className="glass-card p-6 rounded-2xl glow-pulse relative">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#4F9DFF]" />
                Share Itinerary
              </h2>
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter email addresses..."
                    className="w-full glass-input pl-4 pr-20 py-3 text-xs sm:text-sm"
                  />
                  <button className="absolute right-2 top-1.5 bottom-1.5 bg-[#4F9DFF]/15 hover:bg-[#4F9DFF]/30 text-[#4F9DFF] px-4.5 rounded-lg border border-[#4F9DFF]/20 text-xs font-bold transition">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['john@example.com', 'sarah@example.com'].map(email => (
                    <div key={email} className="bg-[#4F9DFF]/10 text-[#4F9DFF] border border-[#4F9DFF]/20 px-3.5 py-1 rounded-full flex items-center gap-2 text-xs font-semibold">
                      <span>{email}</span>
                      <button className="text-xs hover:text-red-400 font-bold transition">×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Share Card */}
            <div className="glass-card p-6 rounded-2xl relative">
              <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 p-3.5 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] text-xs font-bold text-slate-350 transition">
                  <Users className="w-4 h-4 text-[#4F9DFF]" />
                  <span>Co-travelers</span>
                </button>
                <button className="flex items-center justify-center gap-2 p-3.5 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] text-xs font-bold text-slate-350 transition">
                  <Link className="w-4 h-4 text-[#5EEAD4]" />
                  <span>Get Share Link</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Shared With Card */}
            <div className="glass-card p-6 rounded-2xl relative">
              <h3 className="text-lg font-bold text-white mb-6">Shared Collaborators</h3>
              <div className="space-y-3">
                {[
                  { email: 'john@example.com', role: 'Editor' },
                  { email: 'sarah@example.com', role: 'Viewer' }
                ].map(user => (
                  <div key={user.email} className="flex items-center justify-between p-3.5 border border-white/5 rounded-xl bg-black/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4F9DFF] to-[#7C6CF7] flex items-center justify-center border border-white/10 shrink-0">
                        <span className="text-white font-bold text-xs font-mono">{user.email[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-slate-200 font-semibold truncate max-w-[130px] sm:max-w-[180px]">{user.email}</p>
                        <p className="text-[10px] text-[#4F9DFF] font-bold uppercase tracking-wider mt-0.5">{user.role}</p>
                      </div>
                    </div>
                    <button className="text-xs text-slate-500 hover:text-red-400 font-semibold transition">Remove</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sharing Settings Card */}
            <div className="glass-card p-6 rounded-2xl relative">
              <h3 className="text-lg font-bold text-[#7C6CF7] mb-6 flex items-center gap-2">
                <Settings className="w-4.5 h-4.5" />
                Collaborator Settings
              </h3>
              <div className="space-y-4">
                {[
                  'Allow editing',
                  'Allow comments',
                  'Share notifications'
                ].map(setting => (
                  <div key={setting} className="flex items-center justify-between text-xs sm:text-sm text-slate-350 font-medium">
                    <span>{setting}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-10 h-5.5 bg-white/10 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-[#4F9DFF] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4F9DFF]/25"></div>
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