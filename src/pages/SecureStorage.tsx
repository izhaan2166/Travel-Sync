import React from 'react';
import { Navigation } from '../components/Navigation';
import { Shield, Upload, File, Lock } from 'lucide-react';

export function SecureStorage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen animate-mesh pt-24 text-slate-100 relative overflow-hidden">
      <Navigation onBack={onBack} title="Secure Telemetry Vault" />

      {/* Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#4F9DFF]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#7C6CF7]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          <div className="md:col-span-2 space-y-8">
            {/* Document Vault Card */}
            <div className="glass-card p-6 rounded-2xl glow-pulse relative">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#4F9DFF]" />
                Document Vault
              </h2>
              <div className="border-2 border-dashed border-white/10 hover:border-[#4F9DFF]/30 rounded-xl p-8 text-center bg-black/15 transition cursor-pointer">
                <Upload className="w-10 h-10 text-[#4F9DFF] mx-auto mb-4" />
                <p className="text-slate-350 text-sm mb-4">Drag and drop your secure documents here</p>
                <button className="glass-btn px-6 py-2.5 text-xs font-bold transition">
                  Browse Files
                </button>
              </div>
            </div>

            {/* Recent Documents Card */}
            <div className="glass-card p-6 rounded-2xl relative">
              <h3 className="text-lg font-bold text-white mb-6">Recent Vault Items</h3>
              <div className="space-y-3">
                {[
                  { name: 'Passport.pdf', size: '2.4 MB' },
                  { name: 'FlightTickets.pdf', size: '1.8 MB' },
                  { name: 'HotelBooking.pdf', size: '1.2 MB' }
                ].map(doc => (
                  <div key={doc.name} className="flex items-center justify-between p-3.5 border border-white/5 rounded-xl hover:border-[#4F9DFF]/20 bg-black/10 transition cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <File className="w-4 h-4 text-[#4F9DFF] group-hover:scale-105 transition" />
                      <span className="text-slate-200 text-xs sm:text-sm font-semibold">{doc.name}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{doc.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Security Status Card */}
            <div className="glass-card p-6 rounded-2xl relative">
              <h3 className="text-lg font-bold text-[#7C6CF7] mb-6 flex items-center gap-2">
                <Lock className="w-4.5 h-4.5" />
                Security Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3.5 p-3.5 border border-white/5 rounded-xl bg-black/10">
                  <Lock className="w-4 h-4 text-[#5EEAD4]" />
                  <div>
                    <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Encryption Layer</p>
                    <p className="text-xs sm:text-sm text-slate-200 font-bold mt-0.5">AES-256 Active</p>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 p-3.5 border border-white/5 rounded-xl bg-black/10">
                  <Shield className="w-4 h-4 text-[#4F9DFF]" />
                  <div>
                    <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Backup Telemetry</p>
                    <p className="text-xs sm:text-sm text-slate-200 font-bold mt-0.5">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Usage Card */}
            <div className="glass-card p-6 rounded-2xl relative">
              <h3 className="text-lg font-bold text-white mb-6">Storage Usage</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs text-slate-450 mb-2 font-semibold uppercase tracking-wider">
                    <span>Used Space</span>
                    <span className="text-slate-200">75%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#7C6CF7] to-[#4F9DFF] h-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <button className="w-full glass-btn-primary py-3 text-xs font-bold shadow-md shadow-[#4F9DFF]/10">
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