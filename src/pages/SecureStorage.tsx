import React from 'react';
import { Navigation } from '../components/Navigation';
import { Shield, Upload, File, Lock } from 'lucide-react';

export function SecureStorage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0b0f19] pt-16 text-slate-100">
      <Navigation onBack={onBack} title="Secure Storage" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="md:col-span-2 space-y-6">
            <div className="neon-card bg-[#0f172a]/60 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-2xl font-bold text-sky-400 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Document Vault
              </h2>
              <div className="border-2 border-dashed border-sky-500/20 hover:border-sky-500/40 rounded-xl p-8 text-center bg-[#070b13]/30 transition">
                <Upload className="w-12 h-12 text-sky-400 mx-auto mb-4" />
                <p className="text-slate-300 text-sm mb-4">Drag and drop your documents here</p>
                <button className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 px-6 py-2 rounded-xl border border-sky-500/20 hover:border-sky-500/40 transition">
                  Browse Files
                </button>
              </div>
            </div>

            <div className="neon-card bg-[#0f172a]/60 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-sky-400 mb-4">Recent Documents</h3>
              <div className="space-y-3">
                {[
                  { name: 'Passport.pdf', size: '2.4 MB' },
                  { name: 'FlightTickets.pdf', size: '1.8 MB' },
                  { name: 'HotelBooking.pdf', size: '1.2 MB' }
                ].map(doc => (
                  <div key={doc.name} className="flex items-center justify-between p-3 border border-slate-800 rounded-xl hover:border-sky-500/20 hover:bg-sky-500/5 transition cursor-pointer">
                    <div className="flex items-center gap-3">
                      <File className="w-5 h-5 text-sky-400" />
                      <span className="text-slate-200 text-sm">{doc.name}</span>
                    </div>
                    <span className="text-xs text-slate-500">{doc.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="neon-card bg-[#0f172a]/60 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-sky-400 mb-4">Security Status</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border border-slate-800 rounded-xl bg-[#070b13]/40">
                  <Lock className="w-5 h-5 text-sky-400" />
                  <div>
                    <p className="text-xs text-slate-400">Encryption Status</p>
                    <p className="text-sm text-sky-450 font-bold">AES-256 Active</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border border-slate-800 rounded-xl bg-[#070b13]/40">
                  <Shield className="w-5 h-5 text-sky-400" />
                  <div>
                    <p className="text-xs text-slate-400">Last Backup</p>
                    <p className="text-sm text-sky-450 font-bold">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="neon-card bg-[#0f172a]/60 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-sky-400 mb-4">Storage Usage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Used Space</span>
                    <span className="font-bold text-slate-200">75%</span>
                  </div>
                  <div className="w-full bg-slate-850 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-sky-500 h-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <button className="w-full bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 p-3 rounded-xl border border-sky-500/20 hover:border-sky-500/40 text-xs font-bold transition">
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