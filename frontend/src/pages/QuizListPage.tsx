import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { topicApi } from '../api/topicApi';
import { quizApi } from '../api/quizApi';
import { Topic, Quiz, NinjaRank } from '../types/quiz';
import { TopicFilterBar } from '../components/quiz/TopicFilterBar';
import { QuizCard } from '../components/quiz/QuizCard';
import { useAuth } from '../context/AuthContext';
import { useSoundEffect } from '../hooks/useSoundEffect';

export const QuizListPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const { playSound } = useSoundEffect();

  const [topics, setTopics] = useState<Topic[]>([]);

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedTopicSlug = slug || searchParams.get('topic');
  const selectedRank = searchParams.get('rank') as NinjaRank | null;

  // Fetch topics
  useEffect(() => {
    topicApi.getTopics()
      .then((data) => setTopics(data))
      .catch((err) => console.error('Failed to load topics:', err));
  }, []);

  // Fetch quizzes with filters
  useEffect(() => {
    setLoading(true);
    let topicId: number | undefined = undefined;

    if (selectedTopicSlug && topics.length > 0) {
      const match = topics.find((t) => t.slug === selectedTopicSlug);
      if (match) topicId = match.id;
    }

    quizApi.getQuizzes({ topicId, rank: selectedRank || undefined })
      .then((data) => {
        setQuizzes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load quizzes:', err);
        setLoading(false);
      });
  }, [selectedTopicSlug, selectedRank, topics]);

  const handleSelectTopic = (newSlug: string | null) => {
    playSound('click');
    if (slug && newSlug !== slug) {
      // If we were on /topics/:slug, navigate back to /missions with param or empty
      if (newSlug) {
        navigate(`/topics/${newSlug}`);
      } else {
        navigate('/missions');
      }
      return;
    }
    const params = new URLSearchParams(searchParams);
    if (newSlug) {
      params.set('topic', newSlug);
    } else {
      params.delete('topic');
    }
    setSearchParams(params);
  };

  const handleSelectRank = (rank: NinjaRank | null) => {
    playSound('click');
    const params = new URLSearchParams(searchParams);
    if (rank) {
      params.set('rank', rank);
    } else {
      params.delete('rank');
    }
    setSearchParams(params);
  };

  // Filter quizzes by search query
  const filteredQuizzes = quizzes.filter((q) => {
    if (!searchQuery.trim()) return true;
    const qLower = searchQuery.toLowerCase();
    return (
      q.title.toLowerCase().includes(qLower) ||
      q.description.toLowerCase().includes(qLower) ||
      (q.topicName && q.topicName.toLowerCase().includes(qLower))
    );
  });

  return (
    <div className="flex flex-col min-h-screen py-10 max-w-7xl mx-auto px-4 lg:px-12 w-full">
      {/* Header Banner from Stitch design */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#28283d] mb-8">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-surface-container-high text-primary font-label text-xs uppercase tracking-widest font-semibold">
              Official Directive • Leaf Archive
            </span>
            <span className="text-on-surface-variant font-label text-xs">• Vol. VIII</span>
          </div>
          <h1 className="font-headline font-black text-3xl sm:text-4xl text-on-surface tracking-tight uppercase flex items-center gap-3">
            Hokage Mission Assignment Board
            <span className="material-symbols-outlined text-primary text-3xl">local_fire_department</span>
          </h1>
          <p className="font-body text-base text-on-surface-variant">
            Select your trial scroll. Fulfill your duty to the village and ascend the shinobi echelon.
          </p>
        </div>

        {/* Active Shinobi Status - Dynamic Live User */}
        <div className="flex items-center gap-4 p-4 bg-[#1a1a2e] border border-[#28283d] rounded-2xl shadow-md">
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined text-2xl">shield</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
              {user ? `${user.displayName} (${user.ninjaRank}-Rank)` : 'Shinobi Candidate'}
            </span>
            {user ? (
              <span className="font-headline font-bold text-xl text-on-surface flex items-center gap-2">
                {user.chakraRyo.toLocaleString()} <span className="font-label text-xs text-secondary font-bold">Ryo Earned</span>
              </span>
            ) : (
              <button
                onClick={openAuthModal}
                className="font-label text-xs text-primary hover:underline font-bold text-left flex items-center gap-1 mt-1"
              >
                Sign In to Track Ryo <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Container */}
      <div className="bg-[#1a1a2e] border border-[#28283d] rounded-2xl p-6 shadow-xl flex flex-col gap-6 mb-10">
        {/* Search Bar */}
        <div className="relative w-full flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-primary pointer-events-none select-none text-xl">
            swords
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trials, jutsu domains, or keywords..."
            className="w-full bg-[#0c0c1f] text-on-surface placeholder:text-on-surface-variant font-body text-sm pl-12 pr-10 py-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary border border-[#28283d]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-on-surface-variant hover:text-on-surface p-1"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>

        {/* Topic and Rank Filters */}
        <TopicFilterBar
          topics={topics}
          selectedTopicSlug={selectedTopicSlug}
          onSelectTopic={handleSelectTopic}
          selectedRank={selectedRank}
          onSelectRank={handleSelectRank}
        />
      </div>

      {/* Quizzes Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="font-label text-sm text-tertiary uppercase tracking-wider">
            Summoning Trial Scrolls...
          </span>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#1a1a2e] border border-dashed border-[#28283d] text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
            search_off
          </span>
          <h3 className="font-headline font-bold text-xl text-on-surface mb-1">
            No Mission Scrolls Found
          </h3>
          <p className="font-body text-sm text-on-surface-variant max-w-md mx-auto mb-4">
            No trial scrolls matched your active topic or rank filter. Adjust filters to discover other available trials.
          </p>
          <button
            onClick={() => {
              playSound('click');
              setSearchParams(new URLSearchParams());
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container font-label text-xs text-primary"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
};
