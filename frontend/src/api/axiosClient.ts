import { apiClient } from './client';
import { tokenStorage } from '../utils/tokenStorage';

/**
 * Axios-compatible client wrapper bridging standard HTTP calls to apiClient
 * with automatic Bearer token insertion and 401 response clearing/redirection.
 */
export const axiosClient = {
  get: async <T>(url: string, config: RequestInit = {}): Promise<{ data: T }> => {
    const data = await apiClient<T>(url, { ...config, method: 'GET' });
    return { data };
  },

  post: async <T>(url: string, body?: any, config: RequestInit = {}): Promise<{ data: T }> => {
    const data = await apiClient<T>(url, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data };
  },

  put: async <T>(url: string, body?: any, config: RequestInit = {}): Promise<{ data: T }> => {
    const data = await apiClient<T>(url, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data };
  },

  delete: async <T>(url: string, config: RequestInit = {}): Promise<{ data: T }> => {
    const data = await apiClient<T>(url, { ...config, method: 'DELETE' });
    return { data };
  },

  getToken: () => tokenStorage.getToken(),
  clearToken: () => tokenStorage.clearAuth(),
};

export default axiosClient;
