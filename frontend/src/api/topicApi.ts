import { apiClient } from './client';
import { Topic, Quiz } from '../types/quiz';

export const topicApi = {
  /**
   * Fetch all active topics (AI, LLMs, General Knowledge, Current Affairs, Business)
   */
  getTopics: (): Promise<Topic[]> => {
    return apiClient<Topic[]>('/api/topics');
  },

  /**
   * Fetch a single topic by slug
   */
  getTopicBySlug: (slug: string): Promise<Topic> => {
    return apiClient<Topic>(`/api/topics/${slug}`);
  },

  /**
   * Fetch all quizzes belonging to a specific topic
   */
  getQuizzesByTopic: (slug: string): Promise<Quiz[]> => {
    return apiClient<Quiz[]>(`/api/topics/${slug}/quizzes`);
  },
};
