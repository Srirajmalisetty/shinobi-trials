/**
 * Token Storage Utility for Shinobi Trials
 * 
 * SECURITY ARCHITECTURE NOTE ON JWT STORAGE:
 * -----------------------------------------------------------------------------------------
 * In Single Page Applications (SPAs), there are two primary token storage strategies:
 * 1. httpOnly Secure Cookies (Recommended for production):
 *    - In this pattern, the server sets a Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict.
 *    - The browser automatically attaches this cookie to same-origin requests.
 *    - PRO: Immune to JavaScript cross-site scripting (XSS) attacks stealing the token.
 *    - CON: Requires CSRF protection tokens and dedicated domain configuration for cross-origin setups.
 * 
 * 2. Client-side Storage (localStorage / sessionStorage / in-memory):
 *    - The token is held in the browser and transmitted manually via the Authorization: Bearer header.
 *    - PRO: Flexible, straightforward for multi-domain APIs and mobile web wrappers.
 *    - TRADE-OFF / XSS RISK: Any compromised third-party script or XSS vulnerability executing
 *      in the window context could read `localStorage.getItem('shinobi_token')`.
 *    - Mitigation: Rigorous input sanitization, strict Content Security Policy (CSP), and short token TTLs.
 * -----------------------------------------------------------------------------------------
 */

import { UserProfile } from '../api/authApi';

const TOKEN_KEY = 'shinobi_token';
const USER_KEY = 'shinobi_user';

export const tokenStorage = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (e) {
      console.warn('Storage unavailable or blocked:', e);
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error('Failed to store authentication token:', e);
    }
  },

  removeToken: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error('Failed to remove authentication token:', e);
    }
  },

  getUser: (): UserProfile | null => {
    try {
      const serialized = localStorage.getItem(USER_KEY);
      return serialized ? JSON.parse(serialized) : null;
    } catch (e) {
      console.warn('Failed to parse cached user profile:', e);
      return null;
    }
  },

  setUser: (user: UserProfile): void => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to store cached user profile:', e);
    }
  },

  removeUser: (): void => {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error('Failed to remove cached user profile:', e);
    }
  },

  clearAuth: (): void => {
    tokenStorage.removeToken();
    tokenStorage.removeUser();
  },
};
