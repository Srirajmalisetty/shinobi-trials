import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SoundToggleButton } from './SoundToggleButton';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  const navItems = [
    { label: 'Village Gates', path: '/' },
    { label: 'Mission Board', path: '/missions' },
    { label: 'Shinobi ID', path: '/dashboard' },
    { label: 'Component Arts', path: '/components' },
    { label: 'Admin Academy', path: '/admin' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#1a1a2e]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(255,107,26,0.18)] border-b border-[#28283d]">
      <div className="h-20 max-w-7xl mx-auto px-4 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-container to-tertiary p-0.5 shadow-[0_0_15px_rgba(255,107,26,0.5)] transition-transform duration-300 group-hover:rotate-6 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">local_fire_department</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-extrabold text-xl tracking-tight text-on-surface uppercase group-hover:text-primary transition-colors">
                Shinobi Trials
              </span>
              <span className="font-label text-[11px] text-tertiary tracking-widest uppercase -mt-1">
                木ノ葉 • Leaf Academy
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-surface-container-lowest rounded-xl border border-surface-container">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-label text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-container text-white font-semibold shadow-[0_0_14px_rgba(255,107,26,0.45)]'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right HUD: Audio + Dynamic User Info / Auth Modal Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <SoundToggleButton />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* Dynamic User Status Pill */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-[#333348] shadow-[0_0_12px_rgba(244,191,50,0.15)]">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
                <span className="font-label text-xs text-tertiary uppercase tracking-wider font-bold">
                  {user.rank || user.ninjaRank || 'D'} Rank
                </span>
                <span className="text-slate-500">•</span>
                <span className="font-label text-xs text-[#7ed99e] font-semibold flex items-center gap-0.5">
                  ⚡ {user.xp ?? user.chakraRyo ?? 0} XP
                </span>
              </div>

              {/* Profile link */}
              <Link to="/dashboard" className="relative flex items-center gap-2 group" title={`Shinobi: ${user.username}`}>
                <div className="relative p-0.5 rounded-full bg-primary-container">
                  <div className="w-8 h-8 rounded-full bg-[#1e1e32] flex items-center justify-center overflow-hidden border border-[#ff6b1a]">
                    <span className="material-symbols-outlined text-primary text-xl">person</span>
                  </div>
                </div>
                <span className="hidden lg:block font-label text-xs font-bold text-white capitalize">
                  {user.username}
                </span>
              </Link>

              {/* Quick Logout */}
              <button
                onClick={logout}
                title="Sign out of current identity"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-label text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">login</span>
                <span>Gate Entry</span>
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ff6b1a] to-[#ff8c42] hover:brightness-110 text-white font-label text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,107,26,0.4)] transition flex items-center gap-1.5"
              >
                <span>Enlist</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
