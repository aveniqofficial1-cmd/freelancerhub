import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Lock, Mail, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    loginDemoUser,
    addToast
  } = useApp();

  const [email, setEmail] = useState('demo@freelancerhub.com');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('Rithvik Kolipaka');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'forgot') {
      addToast('Password reset link sent to ' + email, 'info');
      setAuthMode('login');
      return;
    }
    loginDemoUser();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />

        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Logo & Headline */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 mb-3 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {authMode === 'login' && 'Sign in to Freelancer Hub'}
              {authMode === 'signup' && 'Create Freelancer Account'}
              {authMode === 'forgot' && 'Reset Your Password'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {authMode === 'login' && 'Manage your projects & turn work into verified proof'}
              {authMode === 'signup' && 'Join top independent developers and designers'}
              {authMode === 'forgot' && 'Enter your registered email for reset instructions'}
            </p>
          </div>

          {/* Quick Demo Login Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">Instant Demo Access</span>
              </div>
              <span className="text-xs text-emerald-800 font-medium">Pre-loaded demo data</span>
            </div>
            <button
              onClick={() => loginDemoUser()}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4" />
              ⚡ One-Click Try Demo Account
            </button>
            <div className="text-[11px] text-slate-600 text-center">
              Demo Credentials: <span className="text-slate-900 font-mono font-bold">demo@freelancerhub.com</span> / <span className="text-slate-900 font-mono font-bold">demo123</span>
            </div>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Or continue with email</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-3">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rithvik Kolipaka"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@freelancerhub.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {authMode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors mt-2"
            >
              {authMode === 'login' && 'Sign In with Email'}
              {authMode === 'signup' && 'Create Free Account'}
              {authMode === 'forgot' && 'Send Reset Link'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Mode switch */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {authMode === 'login' && (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthMode('signup')}
                  className="text-emerald-700 hover:underline font-bold"
                >
                  Sign up
                </button>
              </p>
            )}
            {authMode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-emerald-700 hover:underline font-bold"
                >
                  Sign in
                </button>
              </p>
            )}
            {authMode === 'forgot' && (
              <p>
                Remembered your password?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-emerald-700 hover:underline font-bold"
                >
                  Back to sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
