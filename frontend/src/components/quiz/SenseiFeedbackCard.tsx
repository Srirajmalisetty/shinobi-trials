import React from 'react';
import { AnswerResult } from '../../types/quiz';

interface SenseiFeedbackCardProps {
  answer: AnswerResult;
  index: number;
}

export const SenseiFeedbackCard: React.FC<SenseiFeedbackCardProps> = ({ answer, index }) => {
  const isPerfect = answer.scoreAwarded === answer.maxScore;
  const isPartial = answer.scoreAwarded > 0 && answer.scoreAwarded < answer.maxScore;

  return (
    <div className={`p-6 rounded-2xl border transition-all ${
      answer.isCorrect
        ? 'bg-[#15241b]/40 border-emerald-500/40'
        : 'bg-[#291717]/40 border-red-500/40'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-label font-bold text-sm text-tertiary">
            Q{index + 1}
          </span>
          <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
            {answer.questionType.replace('_', ' ')}
          </span>
          {answer.aiGraded && (
            <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary text-[11px] font-label font-semibold flex items-center gap-1 border border-primary/30">
              <span className="material-symbols-outlined text-xs">auto_awesome</span>
              AI Sensei Evaluated
            </span>
          )}
          {answer.adminOverridden && (
            <span className="px-2 py-0.5 rounded-full bg-tertiary/20 text-tertiary text-[11px] font-label font-semibold border border-tertiary/30">
              Admin Overridden
            </span>
          )}
        </div>

        {/* Score pill */}
        <div className={`px-3 py-1 rounded-full font-label font-bold text-xs flex items-center gap-1 ${
          isPerfect
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : isPartial
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          <span>{answer.scoreAwarded}</span>
          <span className="text-on-surface-variant">/</span>
          <span>{answer.maxScore} pts</span>
        </div>
      </div>

      {/* Question Text */}
      <h4 className="font-headline font-semibold text-base text-on-surface mb-4">
        {answer.questionText}
      </h4>

      {/* Answers comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-[#28283d]">
          <span className="font-label text-[11px] uppercase tracking-wider text-on-surface-variant block mb-1">
            Your Shinobi Answer:
          </span>
          <p className="font-body text-sm text-on-surface font-medium whitespace-pre-wrap">
            {answer.studentAnswer || <span className="text-gray-500 italic">Left blank</span>}
          </p>
        </div>

        {answer.correctAnswer && (
          <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-[#28283d]">
            <span className="font-label text-[11px] uppercase tracking-wider text-secondary block mb-1">
              Correct Scroll Solution:
            </span>
            <p className="font-body text-sm text-secondary font-medium whitespace-pre-wrap">
              {answer.correctAnswer}
            </p>
          </div>
        )}
      </div>

      {/* AI Sensei Critique / Explanation */}
      {answer.aiExplanation && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#ff6b1a]/10 to-[#f4bf32]/10 border border-primary/30 flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-xl mt-0.5">
            psychology
          </span>
          <div className="flex flex-col">
            <span className="font-label text-xs font-bold text-primary uppercase tracking-wider mb-1">
              Sensei Scroll Feedback &amp; Rubric Analysis:
            </span>
            <p className="font-body text-sm text-on-surface leading-relaxed">
              {answer.aiExplanation}
            </p>
          </div>
        </div>
      )}

      {/* Admin Feedback if overridden */}
      {answer.adminFeedback && (
        <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-400 text-lg mt-0.5">
            verified_user
          </span>
          <div className="flex flex-col">
            <span className="font-label text-xs font-bold text-amber-400 uppercase tracking-wider mb-0.5">
              Hokage Council Override Remark:
            </span>
            <p className="font-body text-xs text-on-surface">
              {answer.adminFeedback}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
