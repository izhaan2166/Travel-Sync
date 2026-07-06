import React from 'react';
import { Navigation } from '../components/Navigation';
import { Bell, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';

export function RealTimeUpdates({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen animate-mesh pt-24 text-slate-100 relative overflow-hidden">
      <Navigation onBack={onBack} title="Real-Time Telemetry Updates" />
      
      {/* Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#4F9DFF]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#7C6CF7]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          <div className="space-y-8">
            {/* Latest Updates Card */}
            <div className="glass-card p-6 rounded-2xl glow-pulse relative">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#4F9DFF]" />
                Latest Updates
              </h2>
              <div className="space-y-4">
                {[
                  { text: 'Flight AA123 is on time', status: 'success' },
                  { text: 'Weather alert for Paris', status: 'warning' },
                  { text: 'Hotel check-in available', status: 'info' }
                ].map((update, index) => (
                  <div key={index} className="flex items-center gap-3.5 p-3.5 border border-white/5 rounded-xl bg-black/10">
                    {update.status === 'success' && <CheckCircle className="w-4 h-4 text-[#5EEAD4]" />}
                    {update.status === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                    {update.status === 'info' && <RefreshCw className="w-4 h-4 text-[#7C6CF7]" />}
                    <span className="text-slate-300 text-xs sm:text-sm font-medium">{update.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Settings Card */}
            <div className="glass-card p-6 rounded-2xl relative">
              <h3 className="text-lg font-bold text-white mb-6">Telemetry Settings</h3>
              <div className="space-y-4">
                {[
                  'Flight Updates',
                  'Weather Alerts',
                  'Hotel Updates',
                  'Transport Delays'
                ].map(setting => (
                  <div key={setting} className="flex items-center justify-between text-xs sm:text-sm text-slate-300 font-medium">
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

          <div className="space-y-8">
            {/* Live Status Card */}
            <div className="glass-card p-6 rounded-2xl relative">
              <h3 className="text-lg font-bold text-white mb-6">Engine Status</h3>
              <div className="space-y-6">
                <div className="p-4 border border-white/5 rounded-xl bg-black/10">
                  <div className="flex justify-between items-center mb-2.5 text-xs font-semibold uppercase tracking-wider">
                    <span className="text-slate-450">System Status</span>
                    <span className="text-[#5EEAD4]">Online</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#5EEAD4] to-[#4F9DFF] h-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
                
                <div className="p-4 border border-white/5 rounded-xl bg-black/10">
                  <div className="flex justify-between items-center mb-2.5 text-xs font-semibold uppercase tracking-wider">
                    <span className="text-slate-450">Telemetry Last Update</span>
                    <span className="text-[#4F9DFF]">2 mins ago</span>
                  </div>
                  <button className="w-full glass-btn py-2.5 flex items-center justify-center gap-2 text-xs font-bold transition">
                    <RefreshCw className="w-3.5 h-3.5 text-[#4F9DFF]" />
                    Sync Parameters
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="glass-card p-6 rounded-2xl relative">
              <h3 className="text-lg font-bold text-white mb-6">Quick Diagnostics</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Bell, text: 'Notifications', color: '#4F9DFF' },
                  { icon: AlertCircle, text: 'Alerts', color: '#7C6CF7' },
                  { icon: RefreshCw, text: 'Sync', color: '#5EEAD4' },
                  { icon: CheckCircle, text: 'Status', color: '#4F9DFF' }
                ].map(action => (
                  <button
                    key={action.text}
                    className="flex flex-col items-center justify-center gap-3 p-4 border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] rounded-xl transition text-slate-300"
                  >
                    <action.icon className="w-5 h-5" style={{ color: action.color }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{action.text}</span>
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