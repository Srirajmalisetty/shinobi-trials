import { apiClient } from './client';
import { tokenStorage } from '../utils/tokenStorage';

export interface UserProfile {
  id: string | number;
  username: string;
  email: string;
  role: string;
  rank?: string;
  ninjaRank?: string;
  xp?: number;
  chakraRyo?: number;
  createdAt: string;
  updatedAt?: string;
  displayName?: string;
}

export interface AuthResponse {
  token: string;
  type?: string;
  user: UserProfile;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getCurrentUser: async (token?: string): Promise<UserProfile> => {
    return apiClient<UserProfile>('/api/auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  getMe: async (token?: string): Promise<UserProfile> => {
    return authApi.getCurrentUser(token);
  },

  logout: async (): Promise<void> => {
    tokenStorage.clearAuth();
  },
};
