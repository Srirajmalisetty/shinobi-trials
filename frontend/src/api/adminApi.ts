import { apiClient } from './client';
import { AdminQuizCreate, AiReview, QuizDetail } from '../types/quiz';

export const adminApi = {
  /**
   * Create a new custom quiz with questions, rubric, and assigned topic
   */
  createQuiz: (payload: AdminQuizCreate): Promise<QuizDetail> => {
    return apiClient<QuizDetail>('/api/admin/quizzes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get all AI-graded short-answer submissions requiring Sensei review
   */
  getAiReviews: (): Promise<AiReview[]> => {
    return apiClient<AiReview[]>('/api/admin/reviews');
  },

  /**
   * Approve or override AI-graded score
   */
  overrideAiGrade: (
    answerId: number,
    payload: { scoreAwarded: number; adminFeedback?: string; reviewedBy?: string }
  ): Promise<AiReview> => {
    return apiClient<AiReview>(`/api/admin/reviews/${answerId}/override`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
