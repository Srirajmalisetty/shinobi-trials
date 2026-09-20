import React from 'react';
import { Topic, NinjaRank } from '../../types/quiz';

interface TopicFilterBarProps {
  topics: Topic[];
  selectedTopicSlug: string | null;
  onSelectTopic: (slug: string | null) => void;
  selectedRank: NinjaRank | null;
  onSelectRank: (rank: NinjaRank | null) => void;
}

export const TopicFilterBar: React.FC<TopicFilterBarProps> = ({
  topics,
  selectedTopicSlug,
  onSelectTopic,
  selectedRank,
  onSelectRank,
}) => {
  const ranks: NinjaRank[] = ['D', 'C', 'B', 'A', 'S'];

  return (
    <div className="flex flex-col gap-4">
      {/* Domain Topics */}
      <div className="flex flex-col gap-2">
        <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-base">category</span>
          Jutsu Domains &amp; Topics
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => onSelectTopic(null)}
            className={`px-4 py-2 rounded-lg font-label text-xs whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
              selectedTopicSlug === null
                ? 'bg-primary-container text-white font-semibold shadow-[0_0_14px_rgba(255,107,26,0.45)]'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">apps</span>
            All Scrolls
          </button>

          {topics.map((t) => {
            const isSelected = selectedTopicSlug === t.slug;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTopic(isSelected ? null : t.slug)}
                className={`px-4 py-2 rounded-lg font-label text-xs whitespace-nowrap transition-all duration-200 flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-primary-container text-white font-semibold border-primary-container shadow-[0_0_14px_rgba(255,107,26,0.45)]'
                    : 'bg-surface-container text-on-surface-variant border-[#28283d] hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {t.iconRef || 'psychology'}
                </span>
                <span>{t.name}</span>
                {t.refreshFrequency && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-tight">
                    {t.refreshFrequency}
                  </span>
                )}
                {t.quizCount !== undefined && t.quizCount > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-surface-container-highest text-tertiary'
                  }`}>
                    {t.quizCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty Rank Filters: D, C, B, A, S */}
      <div className="flex flex-col gap-2">
        <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
          <span className="material-symbols-outlined text-tertiary text-base">military_tech</span>
          Ninja Rank Grade
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => onSelectRank(null)}
            className={`px-3 py-1 rounded-md font-label text-xs transition-all ${
              selectedRank === null
                ? 'bg-surface-bright text-on-surface font-semibold border border-primary'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            All Ranks
          </button>
          {ranks.map((rank) => {
            const isRankSelected = selectedRank === rank;
            return (
              <button
                key={rank}
                onClick={() => onSelectRank(isRankSelected ? null : rank)}
                className={`px-3 py-1 rounded-md font-label text-xs transition-all font-bold flex items-center gap-1.5 ${
                  isRankSelected
                    ? 'bg-tertiary text-black shadow-[0_0_12px_rgba(244,191,50,0.5)]'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span>{rank}-Rank</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
