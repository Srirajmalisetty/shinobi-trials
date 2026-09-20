import { apiClient } from './client';
import { SubmissionResponse } from '../types/quiz';
import { UserProfile } from './authApi';

export interface CertificateRecord {
  id: number;
  submissionId: number;
  certificateCode: string;
  studentName: string;
  quizTitle: string;
  topicName: string;
  rank: string;
  scorePercentage: number;
  issuedAt: string;
  qrVerificationUrl: string;
}

export interface DashboardStats {
  user: UserProfile;
  totalAttempts: number;
  passedTrials: number;
  averageScore: number;
  totalChakraEarned: number;
  recentSubmissions: SubmissionResponse[];
  certificates: CertificateRecord[];
}

export const dashboardApi = {
  getMyDashboard: async (_token?: string): Promise<DashboardStats> => {
    return apiClient<DashboardStats>('/api/dashboard/my');
  },

  getUserDashboard: async (username: string): Promise<DashboardStats> => {
    return apiClient<DashboardStats>(`/api/dashboard/${username}`);
  },
};

