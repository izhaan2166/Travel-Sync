import React from 'react';
import { Navigation } from '../components/Navigation';
import { Bell, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';

export function RealTimeUpdates({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-black pt-16">
      <Navigation onBack={onBack} title="Real-Time Updates" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="neon-card bg-black/50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6" />
                Latest Updates
              </h2>
              <div className="space-y-4">
                {[
                  { text: 'Flight AA123 is on time', status: 'success' },
                  { text: 'Weather alert for Paris', status: 'warning' },
                  { text: 'Hotel check-in available', status: 'info' }
                ].map(update => (
                  <div key={update.text} className="flex items-center gap-3 p-3 border border-green-500/30 rounded-lg">
                    {update.status === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {update.status === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-400" />}
                    {update.status === 'info' && <RefreshCw className="w-5 h-5 text-blue-400" />}
                    <span className="text-gray-300">{update.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="neon-card bg-black/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-400 mb-4">Notification Settings</h3>
              <div className="space-y-4">
                {[
                  'Flight Updates',
                  'Weather Alerts',
                  'Hotel Updates',
                  'Transport Delays'
                ].map(setting => (
                  <div key={setting} className="flex items-center justify-between">
                    <span className="text-gray-300">{setting}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-green-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500/20"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="neon-card bg-black/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-400 mb-4">Live Status</h3>
              <div className="space-y-4">
                <div className="p-4 border border-green-500/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">System Status</span>
                    <span className="text-green-400">Online</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
                <div className="p-4 border border-green-500/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Last Update</span>
                    <span className="text-green-400">2 mins ago</span>
                  </div>
                  <button className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-400 p-2 rounded-lg mt-2 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refresh Now
                  </button>
                </div>
              </div>
            </div>

            <div className="neon-card bg-black/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-400 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Bell, text: 'Notifications' },
                  { icon: AlertCircle, text: 'Alerts' },
                  { icon: RefreshCw, text: 'Sync' },
                  { icon: CheckCircle, text: 'Status' }
                ].map(action => (
                  <button
                    key={action.text}
                    className="flex flex-col items-center gap-2 p-4 border border-green-500/30 rounded-lg hover:bg-green-500/10"
                  >
                    <action.icon className="w-6 h-6 text-green-400" />
                    <span className="text-gray-300">{action.text}</span>
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