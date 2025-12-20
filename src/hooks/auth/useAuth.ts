// Custom React Hook for Authentication

'use client';

import { useReducer, useCallback, useEffect, useState } from 'react';
import { authReducer, initialState } from './reducer';
import { login, signup, getCurrentUser, logout as logoutApi, getToken } from './api';
import { LoginRequest, SignupRequest, AuthState } from './types';
import { initiateGoogleOAuth } from './googleOAuth';

export const useAuth = () => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isGoogleOAuthLoading, setIsGoogleOAuthLoading] = useState(false);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      // Try to get user profile if token exists
      getCurrentUser()
        .then((user) => {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user, token },
          });
        })
        .catch(() => {
          // Token might be invalid, clear it
          logoutApi();
          dispatch({ type: 'AUTH_LOGOUT' });
        });
    }
  }, []);

  /**
   * Login user
   */
  const handleLogin = useCallback(async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await login(credentials);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          token: response.access_token,
        },
      });
      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Sign up new user
   */
  const handleSignup = useCallback(async (userData: SignupRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await signup(userData);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          token: response.access_token,
        },
      });
      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Signup failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Logout user
   */
  const handleLogout = useCallback(() => {
    logoutApi();
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  /**
   * Refresh current user data
   */
  const refreshUser = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      dispatch({ type: 'SET_USER', payload: user });
      return { success: true, data: user };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to refresh user';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'AUTH_RESET_ERROR' });
  }, []);

  /**
   * Login/Signup with Google OAuth
   */
  const loginWithGoogle = useCallback(async () => {
    setIsGoogleOAuthLoading(true);
    dispatch({ type: 'AUTH_RESET_ERROR' });

    try {
      await initiateGoogleOAuth(
        async () => {
          // OAuth success callback
          setIsGoogleOAuthLoading(false);
          // Refresh user data after OAuth
          const token = getToken();
          if (token) {
            try {
              const user = await getCurrentUser();
              dispatch({
                type: 'AUTH_SUCCESS',
                payload: { user, token },
              });
            } catch (error) {
              dispatch({
                type: 'AUTH_FAILURE',
                payload: 'Failed to fetch user data after Google OAuth',
              });
            }
          }
        },
        (error) => {
          // OAuth error callback
          setIsGoogleOAuthLoading(false);
          dispatch({
            type: 'AUTH_FAILURE',
            payload: error.message || 'Google OAuth failed',
          });
        }
      );
    } catch (error) {
      setIsGoogleOAuthLoading(false);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to initiate Google OAuth';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
    }
  }, []);

  return {
    ...state,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    refreshUser,
    clearError,
    loginWithGoogle,
    isGoogleOAuthLoading,
  };
};

