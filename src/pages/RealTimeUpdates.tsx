import React from 'react';
import { Navigation } from '../components/Navigation';
import { Bell, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';

export function RealTimeUpdates({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0b0f19] pt-16 text-slate-100">
      <Navigation onBack={onBack} title="Real-Time Updates" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="neon-card bg-[#0f172a]/60 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-2xl font-bold text-sky-400 mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6" />
                Latest Updates
              </h2>
              <div className="space-y-4">
                {[
                  { text: 'Flight AA123 is on time', status: 'success' },
                  { text: 'Weather alert for Paris', status: 'warning' },
                  { text: 'Hotel check-in available', status: 'info' }
                ].map(update => (
                  <div key={update.text} className="flex items-center gap-3 p-3 border border-slate-800 rounded-xl bg-[#070b13]/40">
                    {update.status === 'success' && <CheckCircle className="w-5 h-5 text-sky-450" />}
                    {update.status === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400" />}
                    {update.status === 'info' && <RefreshCw className="w-5 h-5 text-indigo-400" />}
                    <span className="text-slate-350 text-sm">{update.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="neon-card bg-[#0f172a]/60 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-sky-400 mb-4">Notification Settings</h3>
              <div className="space-y-4">
                {[
                  'Flight Updates',
                  'Weather Alerts',
                  'Hotel Updates',
                  'Transport Delays'
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

          <div className="space-y-6">
            <div className="neon-card bg-[#0f172a]/60 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-sky-400 mb-4">Live Status</h3>
              <div className="space-y-4">
                <div className="p-4 border border-slate-800 rounded-xl bg-[#070b13]/30">
                  <div className="flex justify-between items-center mb-2 text-xs">
                    <span className="text-slate-400">System Status</span>
                    <span className="text-sky-400 font-bold">Online</span>
                  </div>
                  <div className="w-full bg-slate-850 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-sky-500 h-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
                <div className="p-4 border border-slate-800 rounded-xl bg-[#070b13]/30">
                  <div className="flex justify-between items-center mb-2 text-xs">
                    <span className="text-slate-400">Last Update</span>
                    <span className="text-sky-400 font-semibold">2 mins ago</span>
                  </div>
                  <button className="w-full bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 p-2.5 border border-sky-500/20 hover:border-sky-500/40 rounded-xl mt-2 flex items-center justify-center gap-2 text-xs font-semibold transition">
                    <RefreshCw className="w-4 h-4 animate-spin-slow" />
                    Refresh Now
                  </button>
                </div>
              </div>
            </div>

            <div className="neon-card bg-[#0f172a]/60 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-sky-400 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Bell, text: 'Notifications' },
                  { icon: AlertCircle, text: 'Alerts' },
                  { icon: RefreshCw, text: 'Sync' },
                  { icon: CheckCircle, text: 'Status' }
                ].map(action => (
                  <button
                    key={action.text}
                    className="flex flex-col items-center justify-center gap-2 p-4 border border-slate-800 hover:border-sky-500/20 hover:bg-sky-500/5 rounded-xl transition text-slate-300"
                  >
                    <action.icon className="w-6 h-6 text-sky-400" />
                    <span className="text-xs">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}