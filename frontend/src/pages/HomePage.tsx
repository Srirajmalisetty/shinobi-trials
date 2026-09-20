import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { topicApi } from '../api/topicApi';
import { Topic } from '../types/quiz';
import { SceneVideoPlayer } from '../components/common/SceneVideoPlayer';
import { useSoundEffect } from '../hooks/useSoundEffect';
import openingSceneVideo from '../assets/videos/opening-scene.mp4';

export const HomePage: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const { playSound } = useSoundEffect();
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    return sessionStorage.getItem('shinobi_has_seen_intro') !== 'true';
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem('shinobi_has_seen_intro', 'true');
    setShowIntro(false);
  };

  useEffect(() => {
    topicApi.getTopics()
      .then((data) => setTopics(data))
      .catch((err) => console.error('Failed to load topics:', err));
  }, []);


  const ranks = [
    { rank: 'D-Rank', title: 'Genin Academic', desc: 'Fundamentals of Chakra, basic AI mechanics & syntax lore', color: 'from-emerald-500/20 to-emerald-700/10 border-emerald-500/30 text-emerald-400' },
    { rank: 'C-Rank', title: 'Chūnin Selection', desc: 'Applied tactics, neural architectures & optimization protocols', color: 'from-teal-500/20 to-teal-700/10 border-teal-500/30 text-teal-400' },
    { rank: 'B-Rank', title: 'Special Jōnin', desc: 'Transformer attention seals, retrieval pipelines & model tuning', color: 'from-cyan-500/20 to-cyan-700/10 border-cyan-500/30 text-cyan-400' },
    { rank: 'A-Rank', title: 'Jōnin Commander', desc: 'Mission systems design, enterprise intelligence & agent swarms', color: 'from-orange-500/20 to-amber-700/10 border-primary/40 text-primary' },
    { rank: 'S-Rank', title: 'Hokage Protocol', desc: 'Legendary mastery across AI frontiers, ethics & village strategy', color: 'from-amber-500/30 to-yellow-600/10 border-tertiary/50 text-tertiary' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Intro Video Overlay (First visit per session, or on-demand, skippable) */}
      {showIntro && (
        <SceneVideoPlayer
          src={openingSceneVideo}
          onComplete={handleIntroComplete}
          skippable={true}
        />
      )}

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden pt-12 pb-24 border-b border-[#28283d]">
        {/* Background ambient lighting */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-primary-container blur-[150px]"></div>
          <div className="absolute top-1/2 right-10 w-96 h-96 rounded-full bg-tertiary blur-[130px] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-12 relative z-10 flex flex-col items-center text-center">
          {/* Live Selection Pill */}
          <div className="inline-flex items-center gap-2.5 bg-surface-container/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#333348] mb-8 shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-container"></span>
            </span>
            <span className="font-label text-xs uppercase tracking-wider text-primary font-bold">
              Chūnin Selection Exam Open
            </span>
            <span className="text-[#5a4137]">•</span>
            <span className="font-label text-xs text-on-surface-variant">
              Leaf Village Examination Hall
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-headline font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-on-surface max-w-4xl leading-tight mb-6">
            Forge Your Destiny at the <span className="bg-gradient-to-r from-primary-container via-tertiary to-primary bg-clip-text text-transparent">Shinobi Academy</span>
          </h1>

          <p className="font-body text-lg sm:text-xl text-on-surface-variant max-w-2xl mb-10 leading-relaxed">
            Ascend through rigorous trials across AI, LLM Architectures, General Knowledge, Current Affairs, and Shinobi Business. Earn official diplomas sealed by the Hokage.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              to="/missions"
              onClick={() => playSound('click')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary-container to-[#ff8c42] hover:from-[#ff8c42] hover:to-primary-container text-white font-label font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,107,26,0.45)] hover:shadow-[0_0_30px_rgba(255,107,26,0.7)] transition-all transform hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-xl">swords</span>
              <span>Enter Mission Board</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setShowIntro(true);
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#1e1e34] hover:bg-[#282845] border border-primary/40 hover:border-primary text-primary hover:text-white font-label font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-[0_0_15px_rgba(255,107,26,0.2)] hover:shadow-[0_0_25px_rgba(255,107,26,0.4)] transform hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-xl text-primary">movie</span>
              <span>Opening Cinematic</span>
            </button>

            <Link
              to="/dashboard"
              onClick={() => playSound('click')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface-container border border-[#333348] hover:border-primary text-on-surface font-label font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all"
            >
              <span className="material-symbols-outlined text-xl text-tertiary">badge</span>
              <span>View Shinobi ID</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Topics Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 lg:px-12 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="font-label text-xs uppercase tracking-widest text-primary flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-sm">menu_book</span>
              Academy Curriculum
            </span>
            <h2 className="font-headline font-extrabold text-3xl sm:text-4xl uppercase text-on-surface">
              Core Examination Topics
            </h2>
          </div>
          <Link
            to="/missions"
            className="text-tertiary hover:text-primary transition-colors font-label text-sm flex items-center gap-1"
          >
            <span>Explore all mission scrolls</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {topics.map((t) => (
            <Link
              key={t.id}
              to={`/missions?topic=${t.slug}`}
              className="group p-6 rounded-2xl bg-[#1a1a2e] border border-[#28283d] hover:border-primary transition-all duration-300 shadow-md hover:shadow-[0_6px_25px_rgba(255,107,26,0.2)] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-white transition-all mb-4">
                  <span className="material-symbols-outlined text-2xl">
                    {t.iconRef || 'psychology'}
                  </span>
                </div>
                <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors mb-2">
                  {t.name}
                </h3>
                <p className="font-body text-xs text-on-surface-variant line-clamp-3 mb-4">
                  {t.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#28283d] font-label text-xs text-tertiary">
                <span>{t.quizCount ?? 0} Trials Available</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ninja Rank Progression Ladder */}
      <section className="py-20 bg-[#0c0c1f] border-t border-[#28283d] w-full">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-label text-xs uppercase tracking-widest text-tertiary flex items-center justify-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-sm">military_tech</span>
              Rank Advancement Protocol
            </span>
            <h2 className="font-headline font-extrabold text-3xl sm:text-4xl uppercase text-on-surface mb-3">
              Shinobi Certification Ladder
            </h2>
            <p className="font-body text-sm text-on-surface-variant">
              Every completed trial is evaluated by the automated Hokage grading engine. Pass exams to earn verifiable certificates signed with official village seals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {ranks.map((r, i) => (
              <div
                key={i}
                className={`p-5 rounded-2xl bg-gradient-to-b ${r.color} border flex flex-col justify-between`}
              >
                <div>
                  <span className="font-headline font-black text-2xl tracking-tight block mb-1">
                    {r.rank}
                  </span>
                  <h4 className="font-label font-bold text-sm text-on-surface mb-2">
                    {r.title}
                  </h4>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                    {r.desc}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-label uppercase">
                  <span>Level {i * 5 + 1}</span>
                  <span className="material-symbols-outlined text-sm">verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
