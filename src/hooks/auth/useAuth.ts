// Custom React Hook for Authentication

'use client';

import { useReducer, useCallback, useEffect, useMemo, useRef } from 'react';
import { authReducer, initialState } from './reducer';
import { login, signup, getCurrentUser, logout as logoutApi, getToken } from './api';
import { LoginRequest, SignupRequest } from './types';
import { initiateGoogleOAuth, extractGoogleOAuthTokenFromUrl } from './googleOAuth';

export const useAuth = () => {
  const [state, dispatch] = useReducer(authReducer, { ...initialState, isLoading: true });
  const initializedRef = useRef(false);

  // Initialize auth state from localStorage on mount (only once)
  // Also check for OAuth token in URL (from Google OAuth redirect)
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Check for OAuth token in URL first (handles Google OAuth redirect)
    const oauthResult = extractGoogleOAuthTokenFromUrl();
    if (oauthResult.success && oauthResult.token) {
      // Token extracted from URL, fetch user data
      dispatch({ type: 'AUTH_START' });
      getCurrentUser()
        .then((user) => {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user, token: oauthResult.token! },
          });
        })
        .catch(() => {
          // Token might be invalid, clear it
          logoutApi();
          dispatch({ type: 'AUTH_LOGOUT' });
        });
      return;
    }
    
    // No OAuth token in URL, check localStorage
    const token = getToken();
    if (token) {
      // Set loading state during check
      dispatch({ type: 'AUTH_START' });
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
    } else {
      // No token, mark as not loading
      dispatch({ type: 'AUTH_LOGOUT' });
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
   * This redirects to the backend OAuth endpoint, which handles the full flow
   * The token will be in the URL when the user is redirected back
   */
  const loginWithGoogle = useCallback(async (redirectUri?: string): Promise<void> => {
    dispatch({ type: 'AUTH_RESET_ERROR' });
    // Simply redirect - backend handles the OAuth flow
    // Token will be extracted from URL when user returns
    initiateGoogleOAuth(redirectUri);
  }, []);

  // Memoize return value to prevent unnecessary re-renders
  // Note: isGoogleOAuthLoading is always false since OAuth is now a simple redirect
  return useMemo(() => ({
    ...state,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    refreshUser,
    clearError,
    loginWithGoogle,
    isGoogleOAuthLoading: false,
  }), [
    state,
    handleLogin,
    handleSignup,
    handleLogout,
    refreshUser,
    clearError,
    loginWithGoogle,
  ]);
};

