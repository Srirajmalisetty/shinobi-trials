import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';
  const isExpired = new URLSearchParams(location.search).get('expired') === '1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim() || !password) {
      setError('Please provide your shinobi identifier and cipher.');
      return;
    }

    setLoading(true);
    try {
      await login({ username: identifier.trim(), password });
      navigate(from, { replace: true });
    } catch (err: any) {
      // Return clear, non-revealing error message
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPreset = (user: string, pass: string) => {
    setIdentifier(user);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Village Gate Background Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-tertiary/10 blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-lg">
        {/* Village Gate Scroll Container */}
        <div className="rounded-3xl bg-[#141428] border-2 border-[#ff6b1a]/30 shadow-[0_0_50px_rgba(255,107,26,0.25)] overflow-hidden relative backdrop-blur-xl">
          {/* Scroll Header Bar */}
          <div className="p-8 border-b border-white/10 bg-gradient-to-r from-[#1c1c38] via-[#16162e] to-[#121224] relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-container to-tertiary p-0.5 shadow-[0_0_20px_rgba(255,107,26,0.6)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-2xl">lock_open</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b1a] shadow-[0_0_8px_#ff6b1a]"></span>
                    <span className="font-label text-xs tracking-widest uppercase text-tertiary font-bold">
                      木ノ葉 • Leaf Village Gates
                    </span>
                  </div>
                  <h1 className="font-headline font-black text-2xl text-white uppercase tracking-tight">
                    Shinobi Clearance
                  </h1>
                </div>
              </div>
              <span className="font-label text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                Gate Entry
              </span>
            </div>
            <p className="mt-2 font-body text-xs text-on-surface-variant">
              Present your academy credentials or chakra signature to cross the village barrier.
            </p>
          </div>

          {/* Session Expired Banner */}
          {isExpired && (
            <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/30 text-amber-300 text-xs font-label flex items-center gap-2">
              <span className="material-symbols-outlined text-base">warning</span>
              Your shinobi chakra session expired. Please sign the gate scroll again.
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-8 mt-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-label flex items-center gap-3 shadow-lg">
              <span className="material-symbols-outlined text-red-400 text-lg">shield</span>
              <div className="flex-1">
                <span className="font-bold uppercase tracking-wider block text-red-400">Chakra Seal Rejected</span>
                {error}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block font-label text-xs text-tertiary uppercase tracking-wider font-bold mb-2">
                Shinobi Name or Academy Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                  account_circle
                </span>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. naruto or ninja@leafvillage.ninja"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#1a1a2e] border border-white/10 text-white placeholder-slate-500 font-body text-sm focus:outline-none focus:border-[#ff6b1a] focus:ring-2 focus:ring-[#ff6b1a]/30 transition shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block font-label text-xs text-tertiary uppercase tracking-wider font-bold mb-2">
                Secret Chakra Cipher (Password)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                  key
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#1a1a2e] border border-white/10 text-white placeholder-slate-500 font-body text-sm focus:outline-none focus:border-[#ff6b1a] focus:ring-2 focus:ring-[#ff6b1a]/30 transition shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-container to-tertiary text-white font-headline font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(255,107,26,0.5)] hover:shadow-[0_0_35px_rgba(255,107,26,0.7)] hover:brightness-110 active:scale-[0.99] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Unsealing Gates...</span>
                </>
              ) : (
                <>
                  <span>Sign the Entry Scroll</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Enlistment Presets */}
          <div className="px-8 pb-6">
            <div className="p-4 rounded-2xl bg-[#111125] border border-white/5 space-y-2">
              <span className="font-label text-[11px] text-slate-400 uppercase tracking-wider block font-bold">
                Academy Candidate Passkeys (Demo Access)
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPreset('naruto', 'shinobi123')}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-primary/20 border border-white/10 text-xs font-label text-slate-300 hover:text-white transition flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                  Naruto (Genin)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('sasuke', 'shinobi123')}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-primary/20 border border-white/10 text-xs font-label text-slate-300 hover:text-white transition flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Sasuke (Genin)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('kakashi', 'sensei123')}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-primary/20 border border-white/10 text-xs font-label text-slate-300 hover:text-white transition flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Kakashi (Jonin/Admin)
                </button>
              </div>
            </div>
          </div>

          {/* Switch to Register */}
          <div className="px-8 py-5 border-t border-white/10 bg-[#0e0e1d] flex items-center justify-between">
            <span className="font-body text-xs text-slate-400">
              New recruit arriving at the village?
            </span>
            <Link
              to="/register"
              className="font-label text-xs font-bold text-primary hover:text-white uppercase tracking-wider transition underline"
            >
              Enlist as Shinobi →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
