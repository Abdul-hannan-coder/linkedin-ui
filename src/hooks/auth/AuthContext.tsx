// Auth Context Provider for shared auth state

'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { User, LoginRequest, SignupRequest, AuthResponse } from './types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; data?: AuthResponse; error?: string }>;
  signup: (userData: SignupRequest) => Promise<{ success: boolean; data?: AuthResponse; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<{ success: boolean; data?: User; error?: string }>;
  clearError: () => void;
  loginWithGoogle: (redirectUri?: string) => Promise<void>;
  isGoogleOAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

