import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Email validation regex
  const isValidEmail = (str: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: 'Empty', level: 0, color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { label: 'Weak (Genin Novice)', level: 1, color: 'bg-red-500' };
    if (score === 3) return { label: 'Moderate (Chunin Adept)', level: 2, color: 'bg-amber-500' };
    if (score === 4) return { label: 'Strong (Jonin Specialist)', level: 3, color: 'bg-emerald-500' };
    return { label: 'Unbreakable (Anbu Secret)', level: 4, color: 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim();
    const cleanEmail = email.trim();

    if (cleanUsername.length < 3 || cleanUsername.length > 50) {
      setError('Shinobi name must be between 3 and 50 characters.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError('Please provide a valid academy ninja email address.');
      return;
    }

    if (password.length < 8) {
      setError('Secret chakra cipher must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Confirmation cipher does not match your chosen password.');
      return;
    }

    setLoading(true);
    try {
      await register({ username: cleanUsername, email: cleanEmail, password });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err.message || 'Academy enlistment failed. Please verify your details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Chakra Aura */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-tertiary/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-lg">
        {/* Enlistment Scroll Box */}
        <div className="rounded-3xl bg-[#141428] border-2 border-[#f4bf32]/30 shadow-[0_0_50px_rgba(244,191,50,0.2)] overflow-hidden relative backdrop-blur-xl">
          {/* Scroll Header */}
          <div className="p-8 border-b border-white/10 bg-gradient-to-r from-[#1c1c38] via-[#16162e] to-[#121224]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-tertiary to-primary-container p-0.5 shadow-[0_0_20px_rgba(244,191,50,0.6)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-2xl">edit_document</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary shadow-[0_0_8px_#f4bf32]"></span>
                    <span className="font-label text-xs tracking-widest uppercase text-tertiary font-bold">
                      忍者登録 • Academy Enlistment
                    </span>
                  </div>
                  <h1 className="font-headline font-black text-2xl text-white uppercase tracking-tight">
                    Shinobi Registration
                  </h1>
                </div>
              </div>
              <span className="font-label text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                Rank D Recruit
              </span>
            </div>
            <p className="mt-2 font-body text-xs text-on-surface-variant">
              Inscribe your name into the Leaf Academy ledger to commence trials, earn ryo, and claim certificates.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-8 mt-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-label flex items-center gap-3 shadow-lg">
              <span className="material-symbols-outlined text-red-400 text-lg">error</span>
              <div className="flex-1">
                <span className="font-bold uppercase tracking-wider block text-red-400">Registration Notice</span>
                {error}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <label className="block font-label text-xs text-tertiary uppercase tracking-wider font-bold mb-2">
                Shinobi Call-Sign (Username)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                  badge
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. minato_namikaze"
                  required
                  minLength={3}
                  maxLength={50}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#1a1a2e] border border-white/10 text-white placeholder-slate-500 font-body text-sm focus:outline-none focus:border-tertiary focus:ring-2 focus:ring-tertiary/30 transition shadow-inner"
                />
              </div>
              <span className="font-label text-[11px] text-slate-500 mt-1 block">
                Unique identifier across the Leaf Village ledger.
              </span>
            </div>

            <div>
              <label className="block font-label text-xs text-tertiary uppercase tracking-wider font-bold mb-2">
                Academy Owl Post (Email)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="recruit@leafvillage.ninja"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#1a1a2e] border border-white/10 text-white placeholder-slate-500 font-body text-sm focus:outline-none focus:border-tertiary focus:ring-2 focus:ring-tertiary/30 transition shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block font-label text-xs text-tertiary uppercase tracking-wider font-bold mb-2">
                Secret Chakra Cipher (Password - min 8 chars)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                  password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters..."
                  required
                  minLength={8}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#1a1a2e] border border-white/10 text-white placeholder-slate-500 font-body text-sm focus:outline-none focus:border-tertiary focus:ring-2 focus:ring-tertiary/30 transition shadow-inner"
                />
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-label">
                    <span className="text-slate-400">Cipher Strength:</span>
                    <span className="text-tertiary font-bold">{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex gap-1">
                    <div className={`h-full flex-1 transition-all duration-300 ${strength.level >= 1 ? strength.color : 'bg-transparent'}`}></div>
                    <div className={`h-full flex-1 transition-all duration-300 ${strength.level >= 2 ? strength.color : 'bg-transparent'}`}></div>
                    <div className={`h-full flex-1 transition-all duration-300 ${strength.level >= 3 ? strength.color : 'bg-transparent'}`}></div>
                    <div className={`h-full flex-1 transition-all duration-300 ${strength.level >= 4 ? strength.color : 'bg-transparent'}`}></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block font-label text-xs text-tertiary uppercase tracking-wider font-bold mb-2">
                Confirm Cipher
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                  verified_user
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your cipher..."
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#1a1a2e] border border-white/10 text-white placeholder-slate-500 font-body text-sm focus:outline-none focus:border-tertiary focus:ring-2 focus:ring-tertiary/30 transition shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-tertiary via-primary-container to-[#ff6b1a] text-white font-headline font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(244,191,50,0.5)] hover:shadow-[0_0_35px_rgba(244,191,50,0.7)] hover:brightness-110 active:scale-[0.99] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Inscribing Ledger...</span>
                </>
              ) : (
                <>
                  <span>Enlist in the Academy</span>
                  <span className="material-symbols-outlined text-lg">draw</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="px-8 py-5 border-t border-white/10 bg-[#0e0e1d] flex items-center justify-between">
            <span className="font-body text-xs text-slate-400">
              Already enrolled in Academy records?
            </span>
            <Link
              to="/login"
              className="font-label text-xs font-bold text-tertiary hover:text-white uppercase tracking-wider transition underline"
            >
              Sign In at Village Gates →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
