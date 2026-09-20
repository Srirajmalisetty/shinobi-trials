export type NinjaRank = 'D' | 'C' | 'B' | 'A' | 'S';

export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';

export interface Topic {
  id: number;
  name: string;
  slug: string;
  description: string;
  iconRef?: string;
  refreshFrequency?: string | null;
  createdAt?: string;
  quizCount?: number;
}

export interface Question {
  id: number;
  questionText: string;
  questionType: QuestionType;
  options?: string[];
  correctAnswer?: string;
  points: number;
  orderNum: number;
}

export interface Quiz {
  id: number;
  topicId?: number;
  topicName?: string;
  topicSlug?: string;
  title: string;
  slug: string;
  description: string;
  ninjaRank: NinjaRank;
  timeLimitSeconds: number;
  passingScore: number;
  totalPoints: number;
  chakraReward: number;
  active?: boolean;
  questionCount?: number;
  createdAt?: string;
}

export interface QuizDetail extends Quiz {
  questions: Question[];
}

export interface AnswerSubmission {
  questionId: number;
  studentAnswer: string;
}

export interface SubmissionRequest {
  quizId: number;
  studentName: string;
  studentEmail?: string;
  timeSpentSeconds: number;
  answers: AnswerSubmission[];
}

export interface AnswerResult {
  questionId: number;
  questionText: string;
  questionType: QuestionType;
  studentAnswer: string;
  correctAnswer?: string;
  scoreAwarded: number;
  maxScore: number;
  isCorrect: boolean;
  aiGraded: boolean;
  aiExplanation?: string;
  adminOverridden?: boolean;
  adminFeedback?: string;
}

export interface SubmissionResponse {
  submissionId: number;
  quizId: number;
  quizTitle: string;
  topicName: string;
  studentName: string;
  studentEmail?: string;
  score: number;
  totalPossible: number;
  percentage: number;
  passed: boolean;
  passingScore: number;
  rankAwarded: NinjaRank;
  chakraEarned: number;
  timeSpentSeconds: number;
  submittedAt: string;
  certificateCode?: string;
  answers: AnswerResult[];
}

export interface Certificate {
  certificateCode: string;
  submissionId: number;
  studentName: string;
  quizTitle: string;
  topicName: string;
  ninjaRank: NinjaRank;
  scorePercentage: number;
  issuedAt: string;
  qrVerificationUrl: string;
}

export interface AiReview {
  id: number;
  submissionId: number;
  questionId: number;
  studentName: string;
  quizTitle: string;
  questionText: string;
  studentAnswer: string;
  correctAnswer?: string;
  rubric?: string;
  scoreAwarded: number;
  maxScore: number;
  aiExplanation?: string;
  adminOverridden: boolean;
  adminFeedback?: string;
  reviewedBy?: string;
  createdAt: string;
}

export interface AdminQuizCreate {
  topicId: number;
  title: string;
  description: string;
  ninjaRank: NinjaRank;
  timeLimitSeconds: number;
  passingScore: number;
  chakraReward: number;
  questions: {
    questionText: string;
    questionType: QuestionType;
    options?: string[];
    correctAnswer?: string;
    rubric?: string;
    points: number;
  }[];
}
