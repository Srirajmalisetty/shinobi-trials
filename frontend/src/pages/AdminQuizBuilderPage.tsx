import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { topicApi } from '../api/topicApi';
import { adminApi } from '../api/adminApi';
import { Topic, NinjaRank, QuestionType, AdminQuizCreate } from '../types/quiz';
import { useAuth } from '../context/AuthContext';

export const AdminQuizBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState<boolean>(true);

  // Form State
  const [topicId, setTopicId] = useState<number>(1);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [ninjaRank, setNinjaRank] = useState<NinjaRank>('C');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(10);
  const [passingScore, setPassingScore] = useState<number>(70);
  const [chakraReward, setChakraReward] = useState<number>(300);

  const [questions, setQuestions] = useState<AdminQuizCreate['questions']>([
    {
      questionText: 'What is the primary optimization objective of reinforcement learning with human feedback (RLHF)?',
      questionType: 'MULTIPLE_CHOICE',
      options: ['Reward Model Alignment', 'Maximal Latency', 'Batch Size Expansion', 'Loss Zeroing'],
      correctAnswer: 'Reward Model Alignment',
      rubric: 'Aligning LLM outputs with human preference vectors.',
      points: 10,
    },
    {
      questionText: 'Explain the difference between few-shot in-context learning and full model fine-tuning.',
      questionType: 'SHORT_ANSWER',
      options: [],
      correctAnswer: 'Few-shot provides demonstration examples in the prompt without modifying weights; fine-tuning updates neural weights via gradient descent.',
      rubric: 'Must state: few-shot alters context window without weight updates, while fine-tuning alters neural weights via backpropagation.',
      points: 10,
    },
  ]);

  const [saving, setSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isAdmin = user?.role === 'ROLE_ADMIN';


  useEffect(() => {
    topicApi.getTopics()
      .then((data) => {
        setTopics(data);
        if (data.length > 0) setTopicId(data[0].id);
        setLoadingTopics(false);
      })
      .catch((err) => {
        console.error('Failed to load topics:', err);
        setLoadingTopics(false);
      });
  }, []);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: '',
        questionType: 'MULTIPLE_CHOICE',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctAnswer: 'Option 1',
        rubric: '',
        points: 10,
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx: number, field: string, value: any) => {
    setQuestions((prev) => {
      const copy = [...prev];
      (copy[idx] as any)[field] = value;
      return copy;
    });
  };

  const handleOptionChange = (qIdx: number, optIdx: number, value: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const opts = [...(copy[qIdx].options || [])];
      opts[optIdx] = value;
      copy[qIdx].options = opts;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Trial Title is required');
      return;
    }
    if (questions.length === 0) {
      setErrorMsg('At least one question is required');
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload: AdminQuizCreate = {
      topicId,
      title: title.trim(),
      description: description.trim(),
      ninjaRank,
      timeLimitSeconds: timeLimitMinutes * 60,
      passingScore,
      chakraReward,
      questions,
    };

    try {
      const created = await adminApi.createQuiz(payload);
      setSuccessMsg(`Trial "${created.title}" successfully inscribed into the Leaf Archive!`);
      setSaving(false);
      setTimeout(() => navigate('/missions'), 1800);
    } catch (err: any) {
      console.error('Failed to create quiz:', err);
      setErrorMsg(err.message || 'Failed to create trial scroll.');
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-10 max-w-5xl mx-auto px-4 lg:px-8 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#28283d] mb-8">
        <div>
          <span className="px-2.5 py-1 rounded bg-primary-container/20 text-primary font-label text-xs uppercase tracking-wider font-bold">
            Sensei Protocol • Secret Archive
          </span>
          <h1 className="font-headline font-black text-3xl uppercase text-white mt-1">
            Hokage Trial Builder
          </h1>
          <p className="font-body text-xs text-on-surface-variant">
            Compose and deploy new assessment scrolls across the five core academy topics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/reviews"
            className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-tertiary font-label text-xs uppercase flex items-center gap-2 border border-[#28283d]"
          >
            <span className="material-symbols-outlined text-sm">rate_review</span>
            AI Sensei Reviews
          </Link>
        </div>
      </div>

      {!isAdmin && (
        <div className="p-4 mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 font-label text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-lg">admin_panel_settings</span>
            <span>
              Proctor permissions required to create mission scrolls. Log in as Kakashi Sensei (Admin) to deploy live scrolls.
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

      {successMsg && (
        <div className="p-4 mb-6 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-label text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-base">verified</span>
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 mb-6 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-label text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {errorMsg}
        </div>
      )}

      {/* Trial Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Basic Settings Card */}
        <div className="p-6 rounded-2xl bg-[#1a1a2e] border border-[#28283d] shadow-lg">
          <h3 className="font-headline font-bold text-lg text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">tune</span>
            Trial Metadata &amp; Topic
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="font-label text-xs uppercase text-on-surface-variant block mb-1">
                Jutsu Topic Domain *
              </label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(Number(e.target.value))}
                className="w-full bg-[#0c0c1f] text-on-surface p-3 rounded-xl border border-[#28283d] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {t.refreshFrequency ? `(${t.refreshFrequency})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-label text-xs uppercase text-on-surface-variant block mb-1">
                Ninja Difficulty Rank *
              </label>
              <select
                value={ninjaRank}
                onChange={(e) => setNinjaRank(e.target.value as NinjaRank)}
                className="w-full bg-[#0c0c1f] text-on-surface p-3 rounded-xl border border-[#28283d] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="D">D-Rank (Genin Academic)</option>
                <option value="C">C-Rank (Chūnin Selection)</option>
                <option value="B">B-Rank (Special Jōnin)</option>
                <option value="A">A-Rank (Jōnin Commander)</option>
                <option value="S">S-Rank (Hokage Protocol)</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="font-label text-xs uppercase text-on-surface-variant block mb-1">
              Trial Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Advanced Chakra Flow & Transformer Decoders"
              className="w-full bg-[#0c0c1f] text-on-surface p-3 rounded-xl border border-[#28283d] text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="mb-4">
            <label className="font-label text-xs uppercase text-on-surface-variant block mb-1">
              Description &amp; Candidate Directive
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the scope and purpose of this trial..."
              className="w-full bg-[#0c0c1f] text-on-surface p-3 rounded-xl border border-[#28283d] text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-label text-xs uppercase text-on-surface-variant block mb-1">
                Time Limit (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                className="w-full bg-[#0c0c1f] text-on-surface p-3 rounded-xl border border-[#28283d] text-xs"
              />
            </div>
            <div>
              <label className="font-label text-xs uppercase text-on-surface-variant block mb-1">
                Passing Score (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="w-full bg-[#0c0c1f] text-on-surface p-3 rounded-xl border border-[#28283d] text-xs"
              />
            </div>
            <div>
              <label className="font-label text-xs uppercase text-on-surface-variant block mb-1">
                Chakra Ryo Reward
              </label>
              <input
                type="number"
                min="50"
                step="50"
                value={chakraReward}
                onChange={(e) => setChakraReward(Number(e.target.value))}
                className="w-full bg-[#0c0c1f] text-on-surface p-3 rounded-xl border border-[#28283d] text-xs"
              />
            </div>
          </div>
        </div>

        {/* Questions Builder Section */}
        <div className="p-6 rounded-2xl bg-[#1a1a2e] border border-[#28283d] shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">assignment</span>
              Examination Questions ({questions.length})
            </h3>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-3.5 py-1.5 rounded-lg bg-primary-container text-white font-label text-xs uppercase font-bold flex items-center gap-1.5 shadow"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Question
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#111125] border border-[#28283d] flex flex-col gap-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded bg-surface-container-high flex items-center justify-center font-label font-bold text-xs text-primary">
                    {idx + 1}
                  </span>

                  <div className="flex items-center gap-3">
                    <select
                      value={q.questionType}
                      onChange={(e) => handleQuestionChange(idx, 'questionType', e.target.value as QuestionType)}
                      className="bg-surface-container-lowest text-on-surface text-xs font-label p-1.5 rounded border border-[#28283d]"
                    >
                      <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                      <option value="TRUE_FALSE">True / False</option>
                      <option value="SHORT_ANSWER">Short Answer (AI Graded)</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Delete question"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-label text-[11px] uppercase text-on-surface-variant block mb-1">
                    Question Prompt
                  </label>
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(idx, 'questionText', e.target.value)}
                    placeholder="Enter question text..."
                    className="w-full bg-[#0c0c1f] text-on-surface p-2.5 rounded-lg border border-[#28283d] text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {q.questionType === 'MULTIPLE_CHOICE' && (
                  <div>
                    <label className="font-label text-[11px] uppercase text-on-surface-variant block mb-1">
                      Options (A, B, C, D)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(q.options || []).map((opt, oIdx) => (
                        <input
                          key={oIdx}
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(idx, oIdx, e.target.value)}
                          placeholder={`Option ${oIdx + 1}`}
                          className="w-full bg-[#0c0c1f] text-on-surface p-2 rounded-lg border border-[#28283d] text-xs"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-label text-[11px] uppercase text-on-surface-variant block mb-1">
                      Correct Answer / Expected Reference
                    </label>
                    <input
                      type="text"
                      value={q.correctAnswer || ''}
                      onChange={(e) => handleQuestionChange(idx, 'correctAnswer', e.target.value)}
                      placeholder="Expected answer..."
                      className="w-full bg-[#0c0c1f] text-secondary p-2 rounded-lg border border-[#28283d] text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-label text-[11px] uppercase text-on-surface-variant block mb-1">
                      Points Value
                    </label>
                    <input
                      type="number"
                      value={q.points}
                      onChange={(e) => handleQuestionChange(idx, 'points', Number(e.target.value))}
                      className="w-full bg-[#0c0c1f] text-on-surface p-2 rounded-lg border border-[#28283d] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label text-[11px] uppercase text-tertiary block mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">psychology</span>
                    AI Sensei Rubric Criteria (Guidelines used by LLM to grade)
                  </label>
                  <input
                    type="text"
                    value={q.rubric || ''}
                    onChange={(e) => handleQuestionChange(idx, 'rubric', e.target.value)}
                    placeholder="e.g. Must mention gradient direction, loss surface, and step size convergence..."
                    className="w-full bg-[#0c0c1f] text-on-surface p-2 rounded-lg border border-[#28283d] text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            to="/missions"
            className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label text-xs uppercase"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-container to-tertiary text-white font-label font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(255,107,26,0.4)] disabled:opacity-50"
          >
            {saving ? 'Inscribing Scroll...' : 'Publish Trial to Mission Board'}
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
      </form>
    </div>
  );
};
