import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi, DashboardStats } from '../api/dashboardApi';
import { useAuth } from '../context/AuthContext';
import { ChakraSpinner } from '../components/common/ChakraSpinner';

export const DashboardPage: React.FC = () => {
  const { user, token, isAuthenticated, openAuthModal } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    dashboardApi.getMyDashboard()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dashboard:', err);
        setError('Could not retrieve your candidate trial logs.');
        setLoading(false);
      });
  }, [isAuthenticated, token, user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <ChakraSpinner size="lg" label="Retrieving Shinobi Ledger..." />
      </div>
    );
  }

  const activeUser = stats?.user || user;

  return (
    <div className="flex flex-col min-h-screen py-10 max-w-7xl mx-auto px-4 lg:px-12 w-full space-y-10">
      {/* Shinobi Profile Header */}
      <div className="p-8 rounded-3xl bg-[#1a1a2e] border border-[#28283d] shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* Shinobi Avatar with chakra aura */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-container to-tertiary p-1 shadow-[0_0_25px_rgba(255,107,26,0.5)] flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-[#111125] flex items-center justify-center overflow-hidden">
                  <span className="material-symbols-outlined text-primary text-5xl">person</span>
                </div>
              </div>
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-tertiary text-black font-label text-[10px] font-black uppercase shadow">
                {activeUser?.rank || activeUser?.ninjaRank || 'D'}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded bg-surface-container-high text-primary font-label text-[11px] uppercase tracking-wider font-bold">
                  {activeUser?.role === 'ADMIN' || activeUser?.role === 'ROLE_ADMIN' ? 'Academy Proctor' : 'Registered Shinobi'}
                </span>
                <span className="text-on-surface-variant text-xs">• Leaf Academy Registry</span>
              </div>
              <h1 className="font-headline font-black text-3xl uppercase text-white mb-1 capitalize">
                {activeUser?.username || 'Shinobi Candidate'}
              </h1>
              <p className="font-body text-xs text-on-surface-variant max-w-md">
                {activeUser?.email || 'ninja@leafvillage.ninja'} • Record validated by Hokage Council.
              </p>
            </div>
          </div>

          {/* Quick Ryo & Stats Pill */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-[#111125] border border-[#28283d] min-w-[280px]">
            <div className="flex flex-col text-center">
              <span className="font-label text-[10px] uppercase text-on-surface-variant">Chakra XP</span>
              <span className="font-headline font-bold text-lg text-secondary mt-0.5">
                ⚡ {activeUser?.xp ?? activeUser?.chakraRyo ?? 0}
              </span>
            </div>
            <div className="flex flex-col text-center border-x border-[#28283d]">
              <span className="font-label text-[10px] uppercase text-on-surface-variant">Trials Done</span>
              <span className="font-headline font-bold text-lg text-tertiary mt-0.5">
                {stats?.totalAttempts ?? 0}
              </span>
            </div>
            <div className="flex flex-col text-center">
              <span className="font-label text-[10px] uppercase text-on-surface-variant">Avg Score</span>
              <span className="font-headline font-bold text-lg text-primary mt-0.5">
                {Math.round(stats?.averageScore || 0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Identity switch bar */}
        {!isAuthenticated && (
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Viewing demo candidate preview. Connect with your own identity to track trials.
            </span>
            <button
              onClick={openAuthModal}
              data-chakra-btn="true"
              className="px-4 py-1.5 rounded-xl bg-primary-container text-white font-label text-xs uppercase font-bold hover:brightness-110 transition"
            >
              Sign In / Register
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Past Trials & Earned Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Trials (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">history</span>
              <h2 className="font-headline font-bold text-xl text-white">Recent Trial Submissions</h2>
            </div>
            <Link to="/missions" className="text-xs font-label text-tertiary hover:underline uppercase">
              Explore Mission Board →
            </Link>
          </div>

          {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
            <div className="space-y-4">
              {stats.recentSubmissions.map((sub) => (
                <div
                  key={sub.submissionId}
                  className="p-5 rounded-2xl bg-[#141428] border border-white/10 hover:border-white/20 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                      sub.passed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}>
                      {sub.rankAwarded || 'D'}
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-base text-white line-clamp-1">
                        {sub.quizTitle}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{sub.topicName}</span>
                        <span>•</span>
                        <span className={sub.passed ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                          {Math.round(sub.percentage)}% ({sub.passed ? 'PASSED' : 'RETRY'})
                        </span>
                        <span>•</span>
                        <span>+{sub.chakraEarned} Ryo</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      to={`/results/${sub.submissionId}`}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-label text-white uppercase transition"
                    >
                      View Results
                    </Link>
                    {sub.certificateCode && (
                      <Link
                        to={`/certificates/${sub.certificateCode}`}
                        className="px-4 py-2 rounded-xl bg-tertiary/20 hover:bg-tertiary/30 border border-tertiary/40 text-xs font-label text-[#ffdf9a] uppercase font-bold transition flex items-center gap-1"
                      >
                        <span>Scroll</span>
                        <span className="material-symbols-outlined text-xs">workspace_premium</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-[#141428] border border-dashed border-white/10 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">menu_book</span>
              <p className="text-sm text-slate-400 mb-4">No exam trials recorded yet in your Shinobi scroll ledger.</p>
              <Link
                to="/missions"
                className="px-6 py-2.5 rounded-xl bg-primary-container text-white text-xs font-label uppercase font-bold"
              >
                Accept Your First Trial
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Earned Certificates */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-xl">workspace_premium</span>
            <h2 className="font-headline font-bold text-xl text-white">Earned Certificates</h2>
          </div>

          {stats?.certificates && stats.certificates.length > 0 ? (
            <div className="space-y-4">
              {stats.certificates.map((cert) => (
                <Link
                  key={cert.id}
                  to={`/certificates/${cert.certificateCode}`}
                  className="block p-5 rounded-2xl bg-gradient-to-b from-[#1c1c38] to-[#121226] border border-[#ffc93c]/40 hover:border-[#ffc93c] chakra-glow-gold transition group"
                >
                  <div className="flex items-center justify-between text-xs text-amber-200 mb-2 font-mono">
                    <span>{cert.rank}-RANK CERTIFIED</span>
                    <span>{cert.scorePercentage}%</span>
                  </div>
                  <h4 className="font-headline font-bold text-base text-white group-hover:text-tertiary transition">
                    {cert.quizTitle}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Topic: {cert.topicName}</p>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-tertiary font-label uppercase">
                    <span>Inspect Diploma Scroll</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#141428] border border-dashed border-white/10 text-center">
              <span className="material-symbols-outlined text-3xl text-slate-600 mb-2">lock</span>
              <p className="text-xs text-slate-400">
                Score 70%+ on any Ninja Trial to earn an official Leaf Village parchment diploma.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
