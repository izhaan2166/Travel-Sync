import React, { useState } from 'react';
import { Shield, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { Navigation } from '../components/navigation/Navigation';
import { useToast } from '../components/common/Toast';

interface Props {
  onBack?: () => void;
}

export const LoginPage: React.FC<Props> = React.memo(({ onBack }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (val: string): boolean => {
    if (!val) {
      setEmailError('Email is required');
      return false;
    }
    const regex = /^\S+@\S+\.\S+$/;
    if (!regex.test(val)) {
      setEmailError('Enter a valid email address (e.g., name@example.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (val: string): boolean => {
    if (!val) {
      setPasswordError('Password is required');
      return false;
    }
    if (val.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError) validateEmail(val);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (passwordError) validatePassword(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      showToast('Please correct form errors before submitting', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Welcome back! Telemetry sync verified.', 'success');
      if (onBack) onBack();
    }, 1500);
  };

  const isFormInvalid = !!emailError || !!passwordError || !email || !password;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Navigation header */}
      <Navigation onBack={onBack} title="Authentication" />

      <div className="max-w-md w-full relative z-10 mt-16">
        {/* Login Card */}
        <div className="travel-card p-8 sm:p-10 rounded-[20px] bg-white border border-slate-200 shadow-lg relative">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#0F3D91] flex items-center justify-center shadow-sm mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#0F3D91] tracking-tight">Welcome Back</h1>
            <p className="text-xs text-slate-500 font-semibold mt-2 text-center leading-relaxed">
              Access your digital vault and itineraries
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={(e) => validateEmail(e.target.value)}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  className={`travel-input w-full pl-10 pr-4 py-3 text-xs sm:text-sm font-medium ${
                    emailError ? 'border-red-500/50 focus:border-red-500 focus:ring-0' : ''
                  }`}
                  placeholder="name@example.com"
                  disabled={loading}
                />
              </div>
              {emailError && (
                <div id="email-error" className="flex items-center gap-1 mt-1.5 text-[10px] text-red-500 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{emailError}</span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={(e) => validatePassword(e.target.value)}
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? "password-error" : undefined}
                  className={`travel-input w-full pl-10 pr-4 py-3 text-xs sm:text-sm font-medium ${
                    passwordError ? 'border-red-500/50 focus:border-red-500 focus:ring-0' : ''
                  }`}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              {passwordError && (
                <div id="password-error" className="flex items-center gap-1 mt-1.5 text-[10px] text-red-500 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{passwordError}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-bold">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded bg-white border-slate-200 text-[#00A896] focus:ring-0 w-3.5 h-3.5" 
                  disabled={loading}
                />
                Remember me
              </label>
              <a href="#" className="text-[#00A896] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading || isFormInvalid}
              className="btn-primary w-full py-3.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Verifying account...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-8 font-semibold">
            Don't have an account?{' '}
            <a href="#" className="font-bold text-[#00A896] hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
});

LoginPage.displayName = 'LoginPage';
