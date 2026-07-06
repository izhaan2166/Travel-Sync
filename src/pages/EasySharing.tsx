import React, { useState } from 'react';
import { Navigation } from '../components/navigation/Navigation';
import { Share2, Users, Link, AlertCircle } from 'lucide-react';
import { useToast } from '../components/common/Toast';

export function EasySharing({ onBack }: { onBack: () => void }) {
  const { showToast } = useToast();
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [collaborators, setCollaborators] = useState([
    { email: 'john@example.com', role: 'Editor' },
    { email: 'sarah@example.com', role: 'Viewer' }
  ]);

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    
    const regex = /^\S+@\S+\.\S+$/;
    if (!regex.test(emailInput)) {
      setEmailError('Please enter a valid email address');
      showToast('Invalid email address format', 'error');
      return;
    }
    
    setEmailError('');
    if (collaborators.some(c => c.email === emailInput.trim())) {
      showToast('Collaborator is already added', 'info');
      return;
    }

    setCollaborators(prev => [...prev, { email: emailInput.trim(), role: 'Viewer' }]);
    showToast(`Invite sent to ${emailInput.trim()}`, 'success');
    setEmailInput('');
  };

  const handleRemoveCollaborator = (email: string) => {
    setCollaborators(prev => prev.filter(c => c.email !== email));
    showToast(`Access revoked for ${email}`, 'info');
  };

  const handleCopyLink = () => {
    const shareUrl = 'https://travelsync.app/share/trip-938b';
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        showToast('Share link copied to clipboard!', 'success');
      })
      .catch(() => {
        showToast('Failed to copy link to clipboard.', 'error');
      });
  };

  return (
    <div className="min-h-screen pt-24 text-slate-800 relative overflow-hidden flex flex-col justify-between bg-[#FAFAFA]">
      <Navigation onBack={onBack} title="Journey Sharing" />

      <div className="max-w-[1280px] w-full mx-auto px-6 sm:px-12 py-8 relative z-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
          
          <div className="space-y-6 text-left">
            {/* Share Itinerary Card */}
            <div className="travel-card p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm relative">
              <h2 className="text-base font-bold text-[#0F3D91] mb-6 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#00A896]" />
                Share Itinerary
              </h2>
              <form onSubmit={handleAddCollaborator} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter email address..."
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    className={`w-full travel-input pl-4 pr-20 py-3 text-xs sm:text-sm font-medium ${
                      emailError ? 'border-red-500/50' : ''
                    }`}
                  />
                  <button 
                    type="submit" 
                    className="absolute right-2 top-1.5 bottom-1.5 bg-[#00A896]/15 hover:bg-[#00A896]/30 text-[#00A896] px-4.5 rounded-lg border border-[#00A896]/20 text-xs font-bold transition uppercase tracking-wider"
                  >
                    Add
                  </button>
                </div>
                
                {emailError && (
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-red-500 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{emailError}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {collaborators.map(c => (
                    <div key={c.email} className="bg-[#00A896]/10 text-[#00A896] border border-[#00A896]/25 px-3 py-1 rounded-full flex items-center gap-2 text-xs font-semibold">
                      <span>{c.email}</span>
                      <button 
                        type="button"
                        onClick={() => handleRemoveCollaborator(c.email)} 
                        className="text-xs hover:text-red-500 font-bold transition leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </form>
            </div>

            {/* Quick Share Card */}
            <div className="travel-card p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm relative">
              <h3 className="text-xs font-bold text-slate-400 mb-6 font-mono uppercase tracking-widest">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => showToast(`Synchronized with ${collaborators.length} collaborators.`, 'success')}
                  className="flex items-center justify-center gap-2 p-3.5 border border-slate-200 bg-slate-50 hover:bg-slate-100/50 rounded-xl text-xs font-bold text-slate-700 transition uppercase tracking-wider"
                >
                  <Users className="w-4 h-4 text-[#00A896]" />
                  <span>Co-travelers</span>
                </button>
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 p-3.5 border border-slate-200 bg-slate-50 hover:bg-slate-100/50 rounded-xl text-xs font-bold text-slate-700 transition uppercase tracking-wider"
                >
                  <Link className="w-4 h-4 text-[#00A896]" />
                  <span>Get Link</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6 text-left">
            {/* Shared With Card */}
            <div className="travel-card p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm relative">
              <h3 className="text-xs font-bold text-slate-400 mb-6 font-mono uppercase tracking-widest">Collaborators</h3>
              
              {collaborators.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <p className="text-slate-455 text-xs italic font-semibold">No co-travelers connected yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {collaborators.map(user => (
                    <div key={user.email} className="flex items-center justify-between p-3.5 border border-slate-200/60 rounded-xl bg-slate-50 hover:border-slate-150 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0F3D91] flex items-center justify-center text-white text-xs font-bold font-mono shrink-0 shadow-sm">
                          <span>{user.email[0].toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-slate-800 font-bold truncate max-w-[130px] sm:max-w-[180px]">{user.email}</p>
                          <p className="text-[9px] text-[#00A896] font-bold uppercase tracking-widest mt-0.5 font-mono">{user.role}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveCollaborator(user.email)}
                        className="text-xs text-slate-500 hover:text-red-500 font-bold transition uppercase tracking-wider"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sharing Settings Card */}
            <div className="travel-card p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm relative">
              <h3 className="text-xs font-bold text-slate-400 mb-6 font-mono uppercase tracking-widest">Permission Controls</h3>
              <div className="space-y-4">
                {[
                  'Allow editing',
                  'Allow comments',
                  'Share notifications'
                ].map(setting => (
                  <div key={setting} className="flex items-center justify-between text-xs sm:text-sm text-slate-650 font-semibold">
                    <span>{setting}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#00A896] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00A896]/20 border border-slate-350/50"></div>
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