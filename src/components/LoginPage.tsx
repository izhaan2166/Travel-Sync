import React, { useState } from 'react';
import { Shield, Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';

interface Props {
  onBack?: () => void;
}

export function LoginPage({ onBack }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API sign-in
    setTimeout(() => {
      setLoading(false);
      if (onBack) onBack();
    }, 1500);
  };

  return (
    <div className="min-h-screen animate-mesh flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glowing Circles */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#4F9DFF]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#7C6CF7]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        )}

        {/* Login Card */}
        <div className="glass-card p-8 sm:p-10 rounded-3xl glow-pulse relative">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4F9DFF] to-[#7C6CF7] flex items-center justify-center shadow-lg shadow-[#4F9DFF]/25 mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gradient-primary">Welcome back</h1>
            <p className="text-sm text-slate-400 mt-2 text-center">
              Access your digital vault and premium itineraries
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-3 text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-3 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="rounded bg-slate-800 border-slate-700 text-[#4F9DFF] focus:ring-0" />
                Remember me
              </label>
              <a href="#" className="font-medium text-[#4F9DFF] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glass-btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying account...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Don't have an account?{' '}
            <a href="#" className="font-semibold text-[#4F9DFF] hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
