import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import { AiReview } from '../types/quiz';
import { useAuth } from '../context/AuthContext';

export const AdminAiReviewPage: React.FC = () => {
  const { user, login } = useAuth();
  const [reviews, setReviews] = useState<AiReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedReview, setSelectedReview] = useState<AiReview | null>(null);

  const isAdmin = user?.role === 'ROLE_ADMIN';


  // Override modal / inline state
  const [overrideScore, setOverrideScore] = useState<number>(10);
  const [overrideFeedback, setOverrideFeedback] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>('Grand Sensei Proctor');
  const [saving, setSaving] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchReviews = () => {
    setLoading(true);
    adminApi.getAiReviews()
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load AI reviews:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openOverrideModal = (review: AiReview) => {
    setSelectedReview(review);
    setOverrideScore(review.scoreAwarded);
    setOverrideFeedback(review.adminFeedback || 'Score adjusted following manual Leaf Council review.');
  };

  const handleSaveOverride = async () => {
    if (!selectedReview) return;
    setSaving(true);
    try {
      const updated = await adminApi.overrideAiGrade(selectedReview.id, {
        scoreAwarded: overrideScore,
        adminFeedback: overrideFeedback,
        reviewedBy: reviewerName,
      });

      setReviews((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
      setToastMsg(`Successfully updated score for answer ID #${updated.id}!`);
      setSelectedReview(null);
      setSaving(false);
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      console.error('Failed to override grade:', err);
      alert(err.message || 'Failed to update grade');
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-10 max-w-6xl mx-auto px-4 lg:px-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#28283d] mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-primary-container/20 text-primary font-label text-xs uppercase tracking-wider font-bold">
              AI Sensei Oversight
            </span>
            <span className="text-on-surface-variant font-label text-xs">• Audit Console</span>
          </div>
          <h1 className="font-headline font-black text-3xl uppercase text-white">
            AI Grading Review &amp; Moderation
          </h1>
          <p className="font-body text-xs text-on-surface-variant">
            Review and adjust AI-evaluated short-answer scrolls to maintain absolute village standards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReviews}
            className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label text-xs uppercase flex items-center gap-1.5 border border-[#28283d]"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Refresh
          </button>
          <Link
            to="/admin/quizzes"
            className="px-4 py-2 rounded-xl bg-primary-container text-white font-label font-bold text-xs uppercase flex items-center gap-1.5 shadow"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Trial
          </Link>
        </div>
      </div>

      {!isAdmin && (
        <div className="p-4 mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 font-label text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-lg">admin_panel_settings</span>
            <span>
              Proctor oversight console. You are viewing audit logs in candidate mode. Sign in as Kakashi Sensei to submit official overrides.
            </span>
          </div>
          <button
            type="button"
            onClick={() => login('kakashi', 'sensei123')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 uppercase tracking-wider whitespace-nowrap self-start sm:self-auto"
          >
            Quick Sign-In as Kakashi
          </button>
        </div>
      )}

      {toastMsg && (
        <div className="p-4 mb-6 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-label text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-base">verified</span>
          {toastMsg}
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="font-label text-sm text-tertiary uppercase tracking-wider">
            Loading AI Audit Logs...
          </span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#1a1a2e] border border-dashed border-[#28283d] text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
            task_alt
          </span>
          <h3 className="font-headline font-bold text-xl text-on-surface mb-1">
            No AI Graded Answers Pending
          </h3>
          <p className="font-body text-xs text-on-surface-variant">
            All submitted short-answer scrolls have been cataloged or none have been attempted yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-6 rounded-2xl bg-[#1a1a2e] border border-[#28283d] shadow-lg flex flex-col gap-4"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#28283d]">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-label font-bold text-xs text-primary">
                    #{r.id}
                  </span>
                  <div>
                    <h4 className="font-headline font-bold text-base text-white">
                      {r.studentName}
                    </h4>
                    <span className="font-label text-xs text-on-surface-variant">
                      Trial: {r.quizTitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full font-label text-xs font-bold ${
                    r.adminOverridden
                      ? 'bg-tertiary/20 text-tertiary border border-tertiary/40'
                      : 'bg-primary-container/20 text-primary border border-primary/40'
                  }`}>
                    {r.scoreAwarded} / {r.maxScore} pts
                  </span>

                  <button
                    onClick={() => openOverrideModal(r)}
                    className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-label text-white flex items-center gap-1 border border-[#333348]"
                  >
                    <span className="material-symbols-outlined text-xs">edit</span>
                    Moderate
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div>
                <span className="font-label text-[11px] uppercase text-on-surface-variant block mb-1">
                  Question Prompt:
                </span>
                <p className="font-headline font-semibold text-sm text-on-surface">
                  {r.questionText}
                </p>
              </div>

              {/* Student Answer vs Reference */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#0c0c1f] border border-[#28283d]">
                  <span className="font-label text-[11px] uppercase text-primary block mb-1">
                    Student Candidate Submission:
                  </span>
                  <p className="font-body text-xs text-on-surface whitespace-pre-wrap">
                    {r.studentAnswer || <span className="text-gray-500 italic">None</span>}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0c0c1f] border border-[#28283d]">
                  <span className="font-label text-[11px] uppercase text-secondary block mb-1">
                    Rubric &amp; Model Answer:
                  </span>
                  <p className="font-body text-xs text-secondary whitespace-pre-wrap">
                    {r.rubric || r.correctAnswer || 'No specific rubric provided.'}
                  </p>
                </div>
              </div>

              {/* AI Explanation */}
              {r.aiExplanation && (
                <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-[#28283d] flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-base mt-0.5">
                    psychology
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label text-[10px] text-primary uppercase font-bold mb-0.5">
                      AI Sensei Rationale:
                    </span>
                    <p className="font-body text-xs text-on-surface">
                      {r.aiExplanation}
                    </p>
                  </div>
                </div>
              )}

              {/* Override status tag */}
              {r.adminOverridden && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-label flex items-center justify-between">
                  <span>Overridden by: {r.reviewedBy || 'Admin'}</span>
                  <span>Feedback: {r.adminFeedback}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Override Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] border border-[#28283d] rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <h3 className="font-headline font-bold text-xl uppercase text-white mb-2">
              Moderate Score #{selectedReview.id}
            </h3>
            <p className="font-body text-xs text-on-surface-variant mb-6">
              Candidate: <strong className="text-white">{selectedReview.studentName}</strong>
            </p>

            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="font-label text-xs uppercase text-on-surface-variant block mb-1">
                  Score Awarded (Max: {selectedReview.maxScore}) *
                </label>
                <input
                  type="number"
                  min="0"
                  max={selectedReview.maxScore}
                  value={overrideScore}
                  onChange={(e) => setOverrideScore(Number(e.target.value))}
                  className="w-full bg-[#0c0c1f] text-on-surface p-3 rounded-xl border border-[#28283d] text-sm focus:outline-none focus:ring-1 focus:ring-primary font-bold"
                />
              </div>

              <div>
                <label className="font-label text-xs uppercase text-on-surface-variant block mb-1">
                  Proctor Feedback / Override Justification *
                </label>
                <textarea
                  rows={3}
                  value={overrideFeedback}
                  onChange={(e) => setOverrideFeedback(e.target.value)}
                  placeholder="State the reasoning for score revision..."
                  className="w-full bg-[#0c0c1f] text-on-surface p-3 rounded-xl border border-[#28283d] text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-label text-xs uppercase text-on-surface-variant block mb-1">
                  Reviewing Sensei Name
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-[#0c0c1f] text-on-surface p-3 rounded-xl border border-[#28283d] text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveOverride}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-primary-container text-white font-label font-bold text-xs uppercase shadow disabled:opacity-50"
              >
                {saving ? 'Updating...' : 'Commit Revision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
