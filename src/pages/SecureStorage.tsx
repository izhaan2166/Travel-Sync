import React from 'react';
import { Navigation } from '../components/Navigation';
import { Shield, Upload, File, Lock } from 'lucide-react';

export function SecureStorage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-black pt-16">
      <Navigation onBack={onBack} title="Secure Storage" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="neon-card bg-black/50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Document Storage
              </h2>
              <div className="border-2 border-dashed border-green-500/30 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-4">Drag and drop your documents here</p>
                <button className="bg-green-500/10 hover:bg-green-500/20 text-green-400 px-6 py-2 rounded-lg neon-card">
                  Browse Files
                </button>
              </div>
            </div>

            <div className="neon-card bg-black/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-400 mb-4">Recent Documents</h3>
              <div className="space-y-3">
                {[
                  { name: 'Passport.pdf', size: '2.4 MB' },
                  { name: 'FlightTickets.pdf', size: '1.8 MB' },
                  { name: 'HotelBooking.pdf', size: '1.2 MB' }
                ].map(doc => (
                  <div key={doc.name} className="flex items-center justify-between p-3 border border-green-500/30 rounded-lg hover:bg-green-500/10">
                    <div className="flex items-center gap-3">
                      <File className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">{doc.name}</span>
                    </div>
                    <span className="text-gray-500">{doc.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="neon-card bg-black/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-400 mb-4">Security Status</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border border-green-500/30 rounded-lg">
                  <Lock className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-gray-300">Encryption Status</p>
                    <p className="text-green-400">Active</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border border-green-500/30 rounded-lg">
                  <Shield className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-gray-300">Last Backup</p>
                    <p className="text-green-400">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="neon-card bg-black/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-400 mb-4">Storage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-gray-300 mb-2">
                    <span>Used Space</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <button className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-400 p-3 rounded-lg neon-card">
                  Upgrade Storage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}