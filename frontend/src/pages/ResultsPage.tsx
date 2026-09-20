import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { submissionApi } from '../api/submissionApi';
import { SubmissionResponse } from '../types/quiz';
import { SenseiFeedbackCard } from '../components/quiz/SenseiFeedbackCard';
import { ChakraSpinner } from '../components/common/ChakraSpinner';
import { SceneVideoPlayer } from '../components/common/SceneVideoPlayer';
import { useSoundEffect } from '../hooks/useSoundEffect';
import victorySceneVideo from '../assets/videos/victory-scene.mp4';
import defeatSceneVideo from '../assets/videos/defeat-scene.mp4';

export const ResultsPage: React.FC = () => {
  const { id, submissionId } = useParams<{ id?: string; submissionId?: string }>();
  const activeSubmissionId = parseInt(submissionId || id || '0', 10);
  const location = useLocation();
  const navigate = useNavigate();
  const { playSound } = useSoundEffect();

  const [result, setResult] = useState<SubmissionResponse | null>(
    (location.state as any)?.resultData || null
  );
  const [loading, setLoading] = useState<boolean>(!result);
  const [showSceneVideo, setShowSceneVideo] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleSceneComplete = () => {
    setShowSceneVideo(false);
    // Scene video has ended; now fire score sound as the score badge reveals
    playSound('score');
  };

  useEffect(() => {
    if (result) return;
    if (!activeSubmissionId) return;

    setLoading(true);
    submissionApi.getSubmission(activeSubmissionId)
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load submission results:', err);
        setError('Could not retrieve evaluation records from Leaf Archive.');
        setLoading(false);
      });
  }, [activeSubmissionId, result]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <ChakraSpinner size="lg" label="Leaf Council Evaluating Chakra Scrolls..." />
      </div>
    );
  }




  if (error || !result) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <span className="material-symbols-outlined text-5xl text-red-400 mb-3">gavel</span>
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-2">Evaluation Not Found</h2>
        <p className="font-body text-sm text-on-surface-variant mb-6">{error || 'No submission found.'}</p>
        <button
          onClick={() => navigate('/missions')}
          className="px-6 py-2.5 rounded-xl bg-primary-container text-white font-label text-xs uppercase font-bold"
        >
          Return to Mission Board
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen py-10 max-w-5xl mx-auto px-4 lg:px-8 w-full">
      {/* Victory or Defeat Scene Video (playing before score badge reveals) */}
      {showSceneVideo && (
        <SceneVideoPlayer
          src={result.passed ? victorySceneVideo : defeatSceneVideo}
          onComplete={handleSceneComplete}
          skippable={true}
        />
      )}

      {/* Top Banner Outcome */}
      <div className={`p-8 rounded-3xl border mb-10 shadow-2xl relative overflow-hidden ${
        result.passed
          ? 'bg-gradient-to-br from-[#122b1c] via-[#1a1a2e] to-[#122b1c] border-emerald-500/50 shadow-[0_0_40px_rgba(46,139,87,0.25)]'
          : 'bg-gradient-to-br from-[#2f1717] via-[#1a1a2e] to-[#2f1717] border-red-500/50 shadow-[0_0_40px_rgba(230,57,70,0.25)]'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg ${
              result.passed
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}>
              <span className="material-symbols-outlined text-4xl">
                {result.passed ? 'verified' : 'cancel'}
              </span>
            </div>
            <div>
              <span className="font-label text-xs uppercase tracking-widest text-tertiary block mb-1">
                Official Trial Outcome • {result.topicName}
              </span>
              <h1 className="font-headline font-black text-3xl sm:text-4xl uppercase text-on-surface mb-2">
                {result.passed ? 'Trial Passed • Rank Confirmed!' : 'Trial Incomplete • Study Further'}
              </h1>
              <p className="font-body text-sm text-on-surface-variant max-w-lg">
                Candidate: <strong className="text-white">{result.studentName}</strong> • {result.quizTitle}
              </p>
            </div>
          </div>

          {/* Big Score Radial Badge — Spec 06 Rank-Up Flash */}
          <div className="relative flex flex-col items-center min-w-[200px]">
            {result.passed && (
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#ff6b1a]/30 via-[#ffc93c]/40 to-transparent blur-md animate-pulse pointer-events-none"></div>
            )}
            <div className={`relative w-full flex flex-col items-center p-5 rounded-2xl bg-surface-container-lowest/90 border ${
              result.passed ? 'border-[#2e8b57] chakra-glow-green' : 'border-white/10'
            }`}>
              <span className="font-label text-[11px] uppercase tracking-wider text-on-surface-variant mb-1">
                Score Attained
              </span>
              <span className={`font-headline font-black text-4xl ${
                result.passed ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {Math.round(result.percentage)}%
              </span>
              <span className="font-label text-xs text-on-surface-variant mt-1">
                {result.score} / {result.totalPossible} pts (Req: {result.passingScore}%)
              </span>
            </div>

            {result.passed && (
              <div className="-mt-3 relative z-10 px-4 py-1.5 rounded-md bg-gradient-to-r from-[#ff6b1a] to-[#ffc93c] text-black font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-1.5 border border-amber-200">
                <svg className="w-3.5 h-3.5 fill-black" viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.5 4.5 2 7.5L12 17l-6.5 4 2-7.5L2 9h7z"/></svg>
                <span>{result.rankAwarded}-Rank Promoted</span>
              </div>
            )}
          </div>

        </div>

        {/* Action Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 font-label text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-tertiary text-sm">military_tech</span>
              Rank Awarded: <strong className="text-white uppercase">{result.rankAwarded}-Rank</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-tertiary text-sm">bolt</span>
              Chakra Ryo: <strong className="text-secondary font-bold">+{result.chakraEarned}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-sm">timer</span>
              Time: <strong>{Math.round(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {result.passed && result.certificateCode && (
              <Link
                to={`/certificates/${result.certificateCode}`}
                onClick={() => playSound('click')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-tertiary to-amber-400 hover:from-amber-400 hover:to-tertiary text-black font-label font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(244,191,50,0.5)] transition-all transform hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-lg">workspace_premium</span>
                <span>Claim Shinobi Diploma</span>
              </Link>
            )}

            <Link
              to="/missions"
              onClick={() => playSound('click')}
              className="px-5 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label text-xs uppercase flex items-center gap-2 border border-[#28283d]"
            >
              <span className="material-symbols-outlined text-base">format_list_bulleted</span>
              <span>More Trials</span>
            </Link>
          </div>
        </div>
      </div>

      {/* AI Sensei Comprehensive Feedback Section */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-white shadow-[0_0_12px_rgba(255,107,26,0.4)]">
            <span className="material-symbols-outlined text-xl">psychology</span>
          </div>
          <div>
            <h3 className="font-headline font-bold text-xl uppercase text-on-surface">
              Hokage AI Sensei Detailed Scroll Review
            </h3>
            <span className="font-label text-xs text-on-surface-variant">
              Exhaustive technical critique &amp; rubric evaluation per answer
            </span>
          </div>
        </div>
      </div>

      {/* Answer Cards List */}
      <div className="flex flex-col gap-5">
        {result.answers.map((ans, idx) => (
          <SenseiFeedbackCard key={ans.questionId} answer={ans} index={idx} />
        ))}
      </div>
    </div>
  );
};
