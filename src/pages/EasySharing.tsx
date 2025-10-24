import React from 'react';
import { Navigation } from '../components/Navigation';
import { Share2, Users, Link, Settings } from 'lucide-react';

export function EasySharing({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-black pt-16">
      <Navigation onBack={onBack} title="Easy Sharing" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="neon-card bg-black/50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
                <Share2 className="w-6 h-6" />
                Share Itinerary
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter email addresses..."
                    className="w-full bg-black border border-green-500/30 rounded-lg p-3"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500/10 hover:bg-green-500/20 text-green-400 px-4 py-1 rounded-lg">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['john@example.com', 'sarah@example.com'].map(email => (
                    <div key={email} className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full flex items-center gap-2">
                      <span>{email}</span>
                      <button className="text-sm hover:text-red-400">×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="neon-card bg-black/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-400 mb-4">Quick Share</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center gap-2 p-3 border border-green-500/30 rounded-lg hover:bg-green-500/10">
                  <Users className="w-4 h-4 text-green-400" />
                  <span>Co-travelers</span>
                </button>
                <button className="flex items-center gap-2 p-3 border border-green-500/30 rounded-lg hover:bg-green-500/10">
                  <Link className="w-4 h-4 text-green-400" />
                  <span>Get Link</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="neon-card bg-black/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-400 mb-4">Shared With</h3>
              <div className="space-y-3">
                {[
                  { email: 'john@example.com', role: 'Editor' },
                  { email: 'sarah@example.com', role: 'Viewer' }
                ].map(user => (
                  <div key={user.email} className="flex items-center justify-between p-3 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <span className="text-green-400">{user.email[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-gray-300">{user.email}</p>
                        <p className="text-sm text-green-400">{user.role}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-red-400">Remove</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="neon-card bg-black/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-400 mb-4">Sharing Settings</h3>
              <div className="space-y-4">
                {[
                  'Allow editing',
                  'Allow comments',
                  'Share notifications'
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
        </div>
      </div>
    </div>
  );
}