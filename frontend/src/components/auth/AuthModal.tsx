import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login({ username, password });
      } else {
        await register({ username, email, password });
      }
    } catch (err: any) {
      console.error('Auth failure:', err);
      const msg = err.response?.data?.message || err.message || 'Chakra seal rejected. Please verify credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setMode('login');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-[#141428] border border-white/10 shadow-[0_0_50px_rgba(255,107,26,0.3)] overflow-hidden">
        {/* Header bar */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#1c1c38] to-[#121224]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary-container shadow-[0_0_8px_#ff6b1a]"></span>
            <span className="font-headline font-black text-lg text-white tracking-wide uppercase">
              {mode === 'login' ? 'Shinobi Identification' : 'Academy Enlistment'}
            </span>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Quick-fill candidate / admin proctor accounts */}
        <div className="p-4 bg-surface-container-lowest/60 border-b border-white/5 flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Quick Identity:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('naruto', 'shinobi123')}
              className="px-2.5 py-1 text-xs rounded-lg bg-[#ff6b1a]/20 border border-[#ff6b1a]/40 text-[#ffb596] hover:bg-[#ff6b1a]/30 font-bold transition flex items-center gap-1"
            >
              <span>🦊 Naruto</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('kakashi', 'sensei123')}
              className="px-2.5 py-1 text-xs rounded-lg bg-[#f4bf32]/20 border border-[#f4bf32]/40 text-[#ffdf9a] hover:bg-[#f4bf32]/30 font-bold transition flex items-center gap-1"
            >
              <span>⚡ Kakashi (Proctor)</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-3 text-xs font-label uppercase font-bold tracking-wider transition ${
              mode === 'login'
                ? 'text-[#ff6b1a] border-b-2 border-[#ff6b1a] bg-white/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-3 text-xs font-label uppercase font-bold tracking-wider transition ${
              mode === 'register'
                ? 'text-[#ff6b1a] border-b-2 border-[#ff6b1a] bg-white/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register Recruit
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-red-400">warning</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-label text-slate-300 mb-1">
              Shinobi Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. naruto, sasuke"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e22] border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-[#ff6b1a] focus:ring-1 focus:ring-[#ff6b1a]"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-label text-slate-300 mb-1">
                Academy Scroll Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ninja@leafvillage.ninja"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e22] border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-[#ff6b1a] focus:ring-1 focus:ring-[#ff6b1a]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-label text-slate-300 mb-1">
              Secret Chakra Cipher (Password)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e22] border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-[#ff6b1a] focus:ring-1 focus:ring-[#ff6b1a]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            data-chakra-btn="true"
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#ff6b1a] to-[#ff8c42] hover:brightness-110 text-white font-label font-bold text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(255,107,26,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Activating Chakra...</span>
            ) : (
              <span>{mode === 'login' ? 'Summon Shinobi Profile' : 'Inscribe into Ledger'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
