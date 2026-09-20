import { apiClient } from './client';
import { Quiz, QuizDetail, NinjaRank } from '../types/quiz';

export interface QuizStartResponse {
  attemptId: number;
  quizId: number;
  quizTitle: string;
  timeLimitSeconds: number;
  startedAt: string;
  expiresAt: string;
}

export const quizApi = {
  /**
   * Search quizzes with optional topic and ninja rank filter
   */
  getQuizzes: (params?: { topicId?: number; rank?: NinjaRank }): Promise<Quiz[]> => {
    const query = new URLSearchParams();
    if (params?.topicId) query.set('topicId', params.topicId.toString());
    if (params?.rank) query.set('rank', params.rank);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiClient<Quiz[]>(`/api/quizzes${queryString}`);
  },

  /**
   * Get full quiz detail with questions for attempting an exam
   */
  getQuizById: (id: number): Promise<QuizDetail> => {
    return apiClient<QuizDetail>(`/api/quizzes/${id}`);
  },

  /**
   * Start a quiz trial session and get server-enforced expiry timestamp
   */
  startQuizSession: (id: number): Promise<QuizStartResponse> => {
    return apiClient<QuizStartResponse>(`/api/quizzes/${id}/start`, {
      method: 'POST',
    });
  },

  /**
   * Get full quiz detail by unique slug
   */
  getQuizBySlug: (slug: string): Promise<QuizDetail> => {
    return apiClient<QuizDetail>(`/api/quizzes/slug/${slug}`);
  },

  /**
   * Get quizzes filtered by ninja difficulty rank
   */
  getQuizzesByRank: (rank: NinjaRank): Promise<Quiz[]> => {
    return apiClient<Quiz[]>(`/api/quizzes/by-rank/${rank}`);
  },
};

