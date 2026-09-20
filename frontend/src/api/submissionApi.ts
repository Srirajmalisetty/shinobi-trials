import { apiClient } from './client';
import { SubmissionRequest, SubmissionResponse } from '../types/quiz';

export const submissionApi = {
  /**
   * Submit raw exam answers for server-side grading via Strategy Pattern & AI Sensei
   */
  submitQuiz: (request: SubmissionRequest): Promise<SubmissionResponse> => {
    return apiClient<SubmissionResponse>('/api/submissions', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Retrieve a previous submission result by ID
   */
  getSubmission: (id: number): Promise<SubmissionResponse> => {
    return apiClient<SubmissionResponse>(`/api/submissions/${id}`);
  },
};
