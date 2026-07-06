import React, { useState } from 'react';
import { Navigation } from '../components/navigation/Navigation';
import { Shield, Upload, File, Lock, Loader2 } from 'lucide-react';
import { useToast } from '../components/common/Toast';

export function SecureStorage({ onBack }: { onBack: () => void }) {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState([
    { name: 'Passport.pdf', size: '2.4 MB' },
    { name: 'FlightTickets.pdf', size: '1.8 MB' },
    { name: 'HotelBooking.pdf', size: '1.2 MB' }
  ]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleMockUpload = () => {
    if (uploadProgress !== null) return;
    setUploadProgress(0);
    
    let progress = 0;
    const timer = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setUploadProgress(null);
          const sampleFiles = ['VisaApproval.pdf', 'TravelInsurance.pdf', 'RentalCarAgreement.pdf'];
          const newFileName = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
          
          setDocuments(prev => [
            { name: newFileName, size: (1 + Math.random() * 2).toFixed(1) + ' MB' },
            ...prev
          ]);
          showToast(`Document "${newFileName}" encrypted and saved in your secure vault.`, 'success');
        }, 400);
      }
    }, 200);
  };

  const handleRemoveDoc = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocuments(prev => prev.filter(d => d.name !== name));
    showToast(`Document "${name}" purged from digital vault.`, 'info');
  };

  return (
    <div className="min-h-screen pt-24 text-slate-800 relative overflow-hidden flex flex-col justify-between bg-[#FAFAFA]">
      <Navigation onBack={onBack} title="Secure Vault" />

      <div className="max-w-[1280px] w-full mx-auto px-6 sm:px-12 py-8 relative z-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
          
          <div className="md:col-span-2 space-y-6 text-left">
            {/* Document Vault Card */}
            <div className="travel-card p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm relative">
              <h2 className="text-base font-bold text-[#0F3D91] mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#00A896]" />
                Document Vault
              </h2>
              
              <div 
                onClick={handleMockUpload}
                className="border border-dashed border-slate-250 hover:border-[#00A896]/55 rounded-xl p-10 text-center bg-slate-50 hover:bg-slate-100/30 transition duration-200 cursor-pointer"
              >
                {uploadProgress !== null ? (
                  <div className="space-y-4">
                    <Loader2 className="w-9 h-9 text-[#00A896] mx-auto animate-spin" />
                    <p className="text-slate-650 text-xs sm:text-sm font-semibold">Encrypting files... {uploadProgress}%</p>
                    <div className="w-48 bg-slate-200 h-1.5 rounded-full mx-auto overflow-hidden">
                      <div className="bg-[#00A896] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-9 h-9 text-[#00A896] mx-auto mb-4" />
                    <p className="text-slate-600 text-xs sm:text-sm font-semibold mb-4 leading-normal">Drag and drop your secure documents here</p>
                    <button type="button" className="btn-secondary px-6 py-2.5 text-xs font-bold uppercase tracking-wider">
                      Browse Files
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Recent Documents Card */}
            <div className="travel-card p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm relative">
              <h3 className="text-xs font-bold text-slate-400 mb-6 font-mono uppercase tracking-widest">Recent Vault Items</h3>
              
              {documents.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <p className="text-slate-455 text-xs italic font-semibold">No secure items archived yet.</p>
                  <button 
                    onClick={handleMockUpload} 
                    className="text-[10px] font-bold text-[#00A896] uppercase tracking-widest font-mono hover:underline"
                  >
                    + Upload First File
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map(doc => (
                    <div key={doc.name} className="flex items-center justify-between p-3.5 border border-slate-200/60 rounded-xl hover:border-[#00A896]/20 bg-slate-50 hover:bg-slate-100/50 transition cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                          <File className="w-4 h-4 text-[#00A896]" />
                        </div>
                        <span className="text-slate-700 text-xs sm:text-sm font-bold group-hover:text-[#00A896] transition">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 font-mono font-bold">{doc.size}</span>
                        <button 
                          onClick={(e) => handleRemoveDoc(doc.name, e)}
                          className="text-xs text-slate-400 hover:text-red-500 font-bold uppercase transition"
                        >
                          Purge
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 text-left">
            {/* Security Status Card */}
            <div className="travel-card p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm relative">
              <h3 className="text-xs font-bold text-slate-400 mb-6 font-mono uppercase tracking-widest">Security Matrix</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3.5 p-4.5 border border-slate-200 rounded-xl bg-slate-50">
                  <Lock className="w-4.5 h-4.5 text-[#00A896]" />
                  <div>
                    <p className="text-[9px] text-slate-450 font-bold uppercase tracking-widest font-mono">Encryption Layer</p>
                    <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1 font-mono">AES-256 GCM Active</p>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 p-4.5 border border-slate-200 rounded-xl bg-slate-50">
                  <Shield className="w-4.5 h-4.5 text-[#0F3D91]" />
                  <div>
                    <p className="text-[9px] text-slate-450 font-bold uppercase tracking-widest font-mono">Backup Sync</p>
                    <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1 font-mono">Synchronized 2h ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Usage Card */}
            <div className="travel-card p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm relative">
              <h3 className="text-xs font-bold text-slate-400 mb-6 font-mono uppercase tracking-widest">Vault Storage</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-450 mb-2 font-bold uppercase tracking-widest font-mono">
                    <span>Used Capacity</span>
                    <span className="text-slate-700">{Math.min(100, Math.round((documents.length / 5) * 100))}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#00A896] h-full transition-all duration-300" style={{ width: `${Math.min(100, (documents.length / 5) * 100)}%` }}></div>
                  </div>
                </div>
                <button 
                  onClick={() => showToast('Upgraded capacity request logged.', 'success')}
                  className="w-full btn-teal py-3 text-xs uppercase tracking-wider"
                >
                  Upgrade Vault
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}