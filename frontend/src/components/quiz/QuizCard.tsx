import React from 'react';
import { Link } from 'react-router-dom';
import { Quiz, NinjaRank } from '../../types/quiz';
import { useSoundEffect } from '../../hooks/useSoundEffect';

interface QuizCardProps {
  quiz: Quiz;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const { playSound } = useSoundEffect();

  const getRankBadgeStyle = (rank: NinjaRank) => {
    switch (rank) {
      case 'S':
        return 'bg-gradient-to-r from-amber-500 to-yellow-300 text-black shadow-[0_0_15px_rgba(244,191,50,0.6)] font-black';
      case 'A':
        return 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-[0_0_12px_rgba(255,107,26,0.5)] font-bold';
      case 'B':
        return 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-bold';
      case 'C':
        return 'bg-emerald-600 text-white font-bold';
      case 'D':
      default:
        return 'bg-surface-container-high text-on-surface-variant font-semibold border border-[#333348]';
    }
  };

  return (
    <div className="group relative bg-[#1a1a2e] rounded-2xl p-6 border border-[#28283d] hover:border-primary transition-all duration-300 shadow-lg hover:shadow-[0_8px_30px_rgba(255,107,26,0.2)] flex flex-col justify-between">
      {/* Chakra corner ornament */}
      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden rounded-tr-2xl">
        <div className="absolute transform rotate-45 bg-primary-container/10 w-12 h-12 -top-6 -right-6 group-hover:bg-primary-container/30 transition-colors"></div>
      </div>

      <div>
        {/* Top Header: Rank & Topic */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider font-label ${getRankBadgeStyle(quiz.ninjaRank)}`}>
            {quiz.ninjaRank}-Rank Trial
          </span>
          {quiz.topicName && (
            <span className="text-xs font-label text-tertiary px-2.5 py-1 rounded-md bg-surface-container border border-surface-container-high">
              {quiz.topicName}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="font-headline font-bold text-xl text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {quiz.title}
        </h3>
        <p className="font-body text-sm text-on-surface-variant line-clamp-3 mb-5">
          {quiz.description}
        </p>
      </div>

      {/* Footer Stats & CTA */}
      <div>
        <div className="grid grid-cols-3 gap-2 py-3 mb-4 border-y border-[#28283d] font-label text-xs">
          <div className="flex flex-col">
            <span className="text-on-surface-variant text-[11px] uppercase">Limit</span>
            <span className="text-on-surface font-semibold flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-xs text-primary">timer</span>
              {Math.round(quiz.timeLimitSeconds / 60)} min
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-on-surface-variant text-[11px] uppercase">Passing</span>
            <span className="text-on-surface font-semibold flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-xs text-secondary">verified</span>
              {quiz.passingScore}%
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-on-surface-variant text-[11px] uppercase">Reward</span>
            <span className="text-tertiary font-bold flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-xs">bolt</span>
              +{quiz.chakraReward}
            </span>
          </div>
        </div>

        <Link
          to={`/attempt/${quiz.id}`}
          onClick={() => playSound('click')}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-container to-[#ff8c42] hover:from-[#ff8c42] hover:to-primary-container text-white font-label font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(255,107,26,0.35)] group-hover:shadow-[0_0_24px_rgba(255,107,26,0.6)] transition-all duration-300"
        >
          <span>Begin Trial Exam</span>
          <span className="material-symbols-outlined text-base transition-transform duration-200 group-hover:translate-x-1">
            swords
          </span>
        </Link>
      </div>
    </div>
  );
};

