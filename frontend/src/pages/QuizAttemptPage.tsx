import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizApi } from '../api/quizApi';
import { submissionApi } from '../api/submissionApi';
import { QuizDetail, Question } from '../types/quiz';
import { ChakraTimer } from '../components/quiz/ChakraTimer';
import { ChakraSpinner } from '../components/common/ChakraSpinner';
import { SceneVideoPlayer } from '../components/common/SceneVideoPlayer';
import { useAuth } from '../context/AuthContext';
import { useSoundEffect } from '../hooks/useSoundEffect';
import quizTransitionVideo from '../assets/videos/quiz-transition.mp4';

export const QuizAttemptPage: React.FC = () => {
  const { id, quizId } = useParams<{ id?: string; quizId?: string }>();
  const activeQuizId = parseInt(quizId || id || '0', 10);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playSound } = useSoundEffect();

  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showTransition, setShowTransition] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);


  // Server-issued timer and attempt session
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [serverExpiresAt, setServerExpiresAt] = useState<string | undefined>(undefined);

  // Candidate info & answers
  const [studentName, setStudentName] = useState<string>(user?.username || 'Uzumaki Candidate');
  const [studentEmail, setStudentEmail] = useState<string>(user?.email || '');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState<number>(Date.now());

  // Energy wipe transition state
  const [energyWipeActive, setEnergyWipeActive] = useState<boolean>(false);

  useEffect(() => {
    if (!activeQuizId) return;
    setLoading(true);

    // Fetch quiz detail and initiate server timer session simultaneously
    Promise.all([
      quizApi.getQuizById(activeQuizId),
      quizApi.startQuizSession(activeQuizId).catch((err) => {
        console.warn('Could not start server-enforced timer session:', err);
        return null;
      }),
    ])
      .then(([quizData, sessionData]) => {
        setQuiz(quizData);
        if (sessionData) {
          setAttemptId(sessionData.attemptId);
          setServerExpiresAt(sessionData.expiresAt);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load quiz details:', err);
        setError('Failed to summon exam trial from Leaf Academy records.');
        setLoading(false);
      });
  }, [activeQuizId]);

  useEffect(() => {
    if (user) {
      setStudentName(user.username);
      if (user.email) setStudentEmail(user.email);
    }
  }, [user]);

  const handleSelectOption = (questionId: number, option: string) => {
    const q = quiz?.questions.find((item) => item.id === questionId);
    if (q && q.correctAnswer) {
      if (q.correctAnswer.trim().toLowerCase() === option.trim().toLowerCase()) {
        playSound('correct');
      } else {
        playSound('wrong');
      }
    } else {
      playSound('click');
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleShortAnswerChange = (questionId: number, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };

  const handleTimeUp = () => {
    playSound('wrong');
    alert('⏱️ Shinobi Chakra Time Expired! Your examination scroll is being sealed now.');
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!quiz || submitting) return;
    if (!studentName.trim()) {
      alert('Please state your Shinobi Candidate Name before submitting your scroll.');
      return;
    }

    setSubmitting(true);
    setError(null);
    playSound('submit');

    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);

    const submissionPayload = {
      quizId: quiz.id,
      attemptId: attemptId || undefined,
      userId: user?.id,
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim() || undefined,
      timeSpentSeconds,
      answers: quiz.questions.map((q) => ({
        questionId: q.id,
        studentAnswer: answers[q.id] || '',
      })),
    };

    try {
      const result = await submissionApi.submitQuiz(submissionPayload);

      // Trigger Shinobi Energy Wipe transition before page swap
      setEnergyWipeActive(true);
      setTimeout(() => {
        navigate(`/results/${result.submissionId}`, { state: { resultData: result } });
      }, 750);
    } catch (err: any) {
      console.error('Failed to submit exam:', err);
      setError(err.message || 'Submission failed. Please verify server connection.');
      setSubmitting(false);
    }
  };

  const currentQuestion: Question | undefined = quiz?.questions[currentIndex];
  const totalQuestions = quiz?.questions.length || 0;
  const answeredCount = Object.keys(answers).filter((k) => (answers[Number(k)] || '').trim() !== '').length;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen pb-20 relative">
      {/* Quiz Transition Scene Video */}
      {showTransition && (
        <SceneVideoPlayer
          src={quizTransitionVideo}
          onComplete={() => setShowTransition(false)}
          skippable={true}
        />
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <ChakraSpinner size="lg" label="Inscribing Exam Scroll..." />
        </div>
      ) : error || !quiz ? (
        <div className="max-w-xl mx-auto py-20 px-4 text-center">
          <span className="material-symbols-outlined text-5xl text-red-400 mb-3">error</span>
          <h2 className="font-headline font-bold text-2xl text-on-surface mb-2">Scroll Summoning Interrupted</h2>
          <p className="font-body text-sm text-on-surface-variant mb-6">{error || 'Quiz not found.'}</p>
          <button
            onClick={() => { playSound('click'); navigate('/missions'); }}
            className="px-6 py-2.5 rounded-xl bg-primary-container text-white font-label text-xs uppercase font-bold"
          >
            Return to Mission Board
          </button>
        </div>
      ) : (
        <>

      {/* Shinobi Energy Wipe overlay on submit */}
      {energyWipeActive && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-[#ff6b1a] to-[#ffc93c] border-r-8 border-white shadow-[0_0_60px_#ffc93c] animate-pulse"></div>
          <div className="relative z-10 text-3xl font-black text-white uppercase tracking-widest bg-black/50 px-8 py-4 rounded-2xl border border-white/20">
            Sealing Examination Scroll...
          </div>
        </div>
      )}

      {/* Sticky Exam HUD */}
      <div className="sticky top-20 z-40 bg-[#111125]/95 backdrop-blur-md border-b border-[#28283d] py-4 shadow-md">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-primary-container text-white font-label font-bold text-xs">
              {quiz.ninjaRank}-Rank Trial
            </span>
            <div>
              <h2 className="font-headline font-bold text-base text-on-surface line-clamp-1">
                {quiz.title}
              </h2>
              <span className="font-label text-xs text-on-surface-variant">
                Question {currentIndex + 1} of {totalQuestions} • {quiz.topicName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ChakraTimer
              initialSeconds={quiz.timeLimitSeconds}
              expiresAt={serverExpiresAt}
              onTimeUp={handleTimeUp}
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              data-chakra-btn="true"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary-container to-[#ff8c42] hover:brightness-110 text-white font-label font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(255,107,26,0.4)] disabled:opacity-50 transition"
            >
              <span className="material-symbols-outlined text-sm">history_edu</span>
              <span>{submitting ? 'Sealing...' : 'Submit Scroll'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-[#1e1e32] h-1.5 mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-container via-tertiary to-secondary transition-all duration-300 shadow-[0_0_8px_#ff6b1a]"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 pt-8 w-full">
        {/* Candidate Bar & Pagination Dots */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-[#181830] p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="material-symbols-outlined text-tertiary text-sm">badge</span>
            <label className="font-label text-xs text-on-surface-variant uppercase whitespace-nowrap">
              Candidate:
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Candidate Name"
              className="bg-[#0c0c1f] text-on-surface px-3 py-1.5 rounded-lg border border-[#28283d] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-48"
            />
          </div>

          {/* Question navigation dots */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            {quiz.questions.map((q, idx) => {
              const isAnswered = !!(answers[q.id] && answers[q.id].trim());
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => { playSound('click'); setCurrentIndex(idx); }}
                  className={`w-7 h-7 rounded-lg font-label text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-primary-container text-white shadow-[0_0_10px_rgba(255,107,26,0.6)]'
                      : isAnswered
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                  title={`Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Question Container */}
        {currentQuestion && (
          <div className="bg-[#1a1a2e] border border-[#28283d] rounded-2xl p-6 sm:p-8 shadow-xl mb-8 relative">
            <div className="flex items-center justify-between gap-4 mb-6">
              <span className="px-3 py-1 rounded-lg bg-surface-container-high text-tertiary font-label text-xs uppercase tracking-wider font-semibold">
                Question {currentIndex + 1} • {currentQuestion.questionType.replace('_', ' ')}
              </span>
              <span className="font-label text-xs text-on-surface-variant">
                Value: <strong className="text-secondary">{currentQuestion.points} Chakra Pts</strong>
              </span>
            </div>

            {/* Prompt */}
            <h3 className="font-headline font-bold text-xl sm:text-2xl text-on-surface mb-8 leading-relaxed">
              {currentQuestion.questionText}
            </h3>

            {/* Input by Question Type */}
            {currentQuestion.questionType === 'MULTIPLE_CHOICE' && (
              <div className="grid grid-cols-1 gap-3.5">
                {(currentQuestion.options || []).map((option, optIdx) => {
                  const isSelected = answers[currentQuestion.id] === option;
                  const optionLetter = String.fromCharCode(65 + optIdx);
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion.id, option)}
                      className={`p-4 rounded-xl border text-left flex items-center gap-4 transition-all duration-200 ${
                        isSelected
                          ? 'bg-primary-container/15 border-primary-container shadow-[0_0_15px_rgba(255,107,26,0.3)] text-white ring-1 ring-[#ff6b1a]'
                          : 'bg-[#111125] border-[#28283d] hover:border-[#5a4137] text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-label font-bold text-xs ${
                        isSelected
                          ? 'bg-primary-container text-white'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        {optionLetter}
                      </span>
                      <span className="font-body text-sm flex-1">{option}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-primary-container bg-primary-container' : 'border-[#5a4137]'
                      }`}>
                        {isSelected && <span className="material-symbols-outlined text-white text-xs">check</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.questionType === 'TRUE_FALSE' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['True', 'False'].map((choice) => {
                  const isSelected = (answers[currentQuestion.id] || '').toLowerCase() === choice.toLowerCase();
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion.id, choice)}
                      className={`p-6 rounded-xl border text-center font-headline font-bold text-lg transition-all duration-200 flex flex-col items-center gap-2 ${
                        isSelected
                          ? 'bg-primary-container/20 border-primary-container shadow-[0_0_18px_rgba(255,107,26,0.35)] text-white ring-1 ring-[#ff6b1a]'
                          : 'bg-[#111125] border-[#28283d] hover:border-[#5a4137] text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl text-primary">
                        {choice === 'True' ? 'check_circle' : 'cancel'}
                      </span>
                      <span>{choice}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.questionType === 'SHORT_ANSWER' && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-label text-on-surface-variant mb-1">
                  <span className="flex items-center gap-1 text-tertiary">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    Hokage AI Sensei will grade this response
                  </span>
                  <span>{(answers[currentQuestion.id] || '').length} characters</span>
                </div>
                <textarea
                  rows={6}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleShortAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Inscribe your reasoned tactical explanation here..."
                  className="w-full bg-[#0c0c1f] text-on-surface placeholder:text-[#5a4137] p-4 rounded-xl border border-[#28283d] focus:outline-none focus:ring-1 focus:ring-primary font-body text-sm leading-relaxed"
                ></textarea>
              </div>
            )}

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#28283d]">
              <button
                type="button"
                onClick={() => { playSound('click'); setCurrentIndex((prev) => Math.max(0, prev - 1)); }}
                disabled={currentIndex === 0}
                className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high disabled:opacity-30 text-on-surface font-label text-xs uppercase flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Previous
              </button>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={() => { playSound('click'); setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1)); }}
                  data-chakra-btn="true"
                  className="px-6 py-2.5 rounded-xl bg-primary-container hover:bg-[#ff8c42] text-white font-label font-bold text-xs uppercase flex items-center gap-2 shadow-md transition"
                >
                  Next Question
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  data-chakra-btn="true"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-label font-bold text-xs uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(46,139,87,0.4)] transition"
                >
                  Finalize &amp; Score Scroll
                  <span className="material-symbols-outlined text-sm">verified</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};
