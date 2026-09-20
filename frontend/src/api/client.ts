import { tokenStorage } from '../utils/tokenStorage';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const token = tokenStorage.getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized globally by clearing token and redirecting if not on public auth endpoints
  if (response.status === 401) {
    const isAuthEndpoint = endpoint.includes('/api/auth/login') || endpoint.includes('/api/auth/register');
    if (!isAuthEndpoint) {
      tokenStorage.clearAuth();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login?expired=1';
      }
    }
  }

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (_) {}
    throw new Error(errorMessage);
  }

  // If response is empty (e.g. 204)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
