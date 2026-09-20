import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, UserProfile, LoginPayload, RegisterPayload } from '../api/authApi';
import { tokenStorage } from '../utils/tokenStorage';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (payloadOrUsername: LoginPayload | string, password?: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => tokenStorage.getToken());
  const [user, setUser] = useState<UserProfile | null>(() => tokenStorage.getUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = tokenStorage.getToken();
      if (storedToken) {
        try {
          const profile = await authApi.getCurrentUser(storedToken);
          setUser(profile);
          tokenStorage.setUser(profile);
          setToken(storedToken);
        } catch (err) {
          console.warn('Stored session invalid or expired:', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (payloadOrUsername: LoginPayload | string, password?: string) => {
    const payload: LoginPayload = typeof payloadOrUsername === 'string'
      ? { username: payloadOrUsername, password: password || '' }
      : payloadOrUsername;
    const res = await authApi.login(payload);
    setToken(res.token);
    setUser(res.user);
    tokenStorage.setToken(res.token);
    tokenStorage.setUser(res.user);
    setIsAuthModalOpen(false);
  };

  const register = async (payload: RegisterPayload) => {
    const res = await authApi.register(payload);
    setToken(res.token);
    setUser(res.user);
    tokenStorage.setToken(res.token);
    tokenStorage.setUser(res.user);
    setIsAuthModalOpen(false);
  };

  const refreshProfile = async () => {
    const currentToken = tokenStorage.getToken();
    if (currentToken) {
      try {
        const profile = await authApi.getCurrentUser(currentToken);
        setUser(profile);
        tokenStorage.setUser(profile);
      } catch (err) {
        console.warn('Failed to refresh profile:', err);
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    tokenStorage.clearAuth();
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
