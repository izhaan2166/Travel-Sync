import React, { useState } from 'react';
import { Navigation } from '../components/navigation/Navigation';
import { Bell, AlertCircle, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '../components/common/Toast';

export function RealTimeUpdates({ onBack }: { onBack: () => void }) {
  const { showToast } = useToast();
  const [syncing, setSyncing] = useState(false);
  const [toggles, setToggles] = useState({
    flights: true,
    weather: true,
    hotels: true,
    transport: true
  });

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      showToast('Telemetry parameters successfully synchronized.', 'success');
    }, 1200);
  };

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => {
      const next = { ...prev, [key]: !prev[key] };
      showToast(`${key.charAt(0).toUpperCase() + key.slice(1)} notification settings updated.`, 'info');
      return next;
    });
  };

  return (
    <div className="min-h-screen pt-24 text-slate-800 relative overflow-hidden flex flex-col justify-between bg-[#FAFAFA]">
      <Navigation onBack={onBack} title="Real-Time Telemetry" />

      <div className="max-w-[1280px] w-full mx-auto px-6 sm:px-12 py-8 relative z-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
          
          <div className="space-y-6 text-left">
            {/* Latest Updates Card */}
            <div className="travel-card p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm relative">
              <h2 className="text-base font-bold text-[#0F3D91] mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#00A896]" />
                Latest Updates
              </h2>
              <div className="space-y-3">
                {[
                  { text: 'Flight AA123 is on time', status: 'success' },
                  { text: 'Weather alert for Paris', status: 'warning' },
                  { text: 'Hotel check-in available', status: 'info' }
                ].map((update, index) => (
                  <div key={index} className="flex items-center gap-3.5 p-4 border border-slate-200/60 rounded-xl bg-slate-50">
                    {update.status === 'success' && <CheckCircle className="w-4.5 h-4.5 text-[#00A896]" />}
                    {update.status === 'warning' && <AlertCircle className="w-4.5 h-4.5 text-amber-500" />}
                    {update.status === 'info' && <RefreshCw className="w-4.5 h-4.5 text-slate-450 animate-spin-slow" />}
                    <span className="text-slate-700 text-xs sm:text-sm font-semibold">{update.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Settings Card */}
            <div className="travel-card p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm relative">
              <h3 className="text-xs font-bold text-slate-400 mb-6 font-mono uppercase tracking-widest">Telemetry Settings</h3>
              <div className="space-y-4">
                {(Object.keys(toggles) as Array<keyof typeof toggles>).map(key => (
                  <div key={key} className="flex items-center justify-between text-xs sm:text-sm text-slate-650 font-semibold">
                    <span className="capitalize">{key} Updates</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={toggles[key]} 
                        onChange={() => handleToggle(key)}
                        disabled={syncing}
                      />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#00A896] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00A896]/20 border border-slate-300/80"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 text-left">
            {/* Live Status Card */}
            <div className="travel-card p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm relative">
              <h3 className="text-xs font-bold text-slate-400 mb-6 font-mono uppercase tracking-widest">Engine Status</h3>
              <div className="space-y-6">
                <div className="p-4.5 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="flex justify-between items-center mb-2.5 text-[10px] font-bold uppercase tracking-widest font-mono">
                    <span className="text-slate-450">System Status</span>
                    <span className="text-[#00A896]">Online</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#00A896] h-full transition-all duration-500" style={{ width: syncing ? '40%' : '98%' }}></div>
                  </div>
                </div>
                
                <div className="p-4.5 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="flex justify-between items-center mb-2 text-[10px] font-bold uppercase tracking-widest font-mono">
                    <span className="text-slate-450">Telemetry Sync</span>
                    <span className="text-slate-650">{syncing ? 'Synchronizing...' : '2 mins ago'}</span>
                  </div>
                  <button 
                    onClick={handleSync}
                    disabled={syncing}
                    className="w-full btn-secondary py-2.5 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                  >
                    {syncing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00A896]" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 text-[#00A896]" />
                        Sync Parameters
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Diagnostics Quick Buttons */}
            <div className="travel-card p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm relative">
              <h3 className="text-xs font-bold text-slate-400 mb-6 font-mono uppercase tracking-widest">Diagnostics</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Bell, text: 'Notifications', color: '#0F3D91' },
                  { icon: AlertCircle, text: 'Alerts', color: '#00A896' },
                  { icon: RefreshCw, text: 'Sync', color: '#00A896' },
                  { icon: CheckCircle, text: 'Status', color: '#0F3D91' }
                ].map(action => (
                  <button
                    key={action.text}
                    onClick={() => showToast(`Diagnostic check completed for ${action.text}. Status: Normal.`, 'success')}
                    disabled={syncing}
                    className="flex flex-col items-center justify-center gap-3.5 p-4.5 border border-slate-200 bg-slate-50 hover:bg-slate-100/50 rounded-xl transition text-slate-700 hover:text-slate-905"
                  >
                    <action.icon className="w-5 h-5" style={{ color: action.color }} />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono leading-none">{action.text}</span>
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