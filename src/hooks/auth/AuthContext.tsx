// Auth Context Provider for shared auth state

'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './useAuth';

interface AuthContextType {
  user: any;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: any) => Promise<any>;
  signup: (userData: any) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<any>;
  clearError: () => void;
  loginWithGoogle: () => Promise<void>;
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

