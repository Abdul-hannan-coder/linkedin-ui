// Custom React Hook for LinkedIn OAuth

'use client';

import { useReducer, useCallback, useEffect, useMemo, useRef } from 'react';
import { linkedInReducer, initialState } from './reducer';
import {
  getLinkedInToken,
  createLinkedInToken,
  refreshLinkedInToken,
  deleteLinkedInToken,
} from './api';
import { LinkedInTokenData } from './types';

export const useLinkedIn = () => {
  const [state, dispatch] = useReducer(linkedInReducer, { ...initialState, isLoading: true });
  const initializedRef = useRef(false);

  // Initialize LinkedIn connection status on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    checkConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // checkConnection is stable, safe to omit

  /**
   * Check LinkedIn connection status
   */
  const checkConnection = useCallback(async () => {
    try {
      dispatch({ type: 'LINKEDIN_START' });
      const tokenData = await getLinkedInToken();
      
      if (tokenData) {
        dispatch({ type: 'LINKEDIN_SUCCESS', payload: tokenData });
      } else {
        dispatch({ type: 'LINKEDIN_DISCONNECT' });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to check LinkedIn connection';
      dispatch({ type: 'LINKEDIN_FAILURE', payload: errorMessage });
    }
  }, []);

  /**
   * Initiate LinkedIn OAuth connection (returns auth URL)
   */
  const connectLinkedIn = useCallback(async () => {
    try {
      dispatch({ type: 'LINKEDIN_START' });
      dispatch({ type: 'LINKEDIN_RESET_ERROR' });
      
      const response = await createLinkedInToken();
      
      return { 
        success: true, 
        authUrl: response.data.auth_url,
        data: response 
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to initiate LinkedIn connection';
      dispatch({ type: 'LINKEDIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Refresh LinkedIn token
   */
  const refreshToken = useCallback(async () => {
    try {
      dispatch({ type: 'LINKEDIN_START' });
      const response = await refreshLinkedInToken();
      
      const tokenData: LinkedInTokenData = {
        user_id: response.data.user_id,
        access_token: response.data.access_token,
        token_type: response.data.token_type,
        scope: response.data.scope,
        expires_at: response.data.expires_at,
        created_at: new Date().toISOString(),
        id: 0, // Not returned in refresh response
        refresh_token: response.data.refresh_token,
        expires_in: response.data.expires_in,
        linkedin_user_id: response.data.linkedin_user_id,
        updated_at: null,
      };
      
      dispatch({ type: 'LINKEDIN_SUCCESS', payload: tokenData });
      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to refresh LinkedIn token';
      dispatch({ type: 'LINKEDIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Disconnect LinkedIn
   */
  const disconnectLinkedIn = useCallback(async () => {
    try {
      dispatch({ type: 'LINKEDIN_START' });
      await deleteLinkedInToken();
      dispatch({ type: 'LINKEDIN_DISCONNECT' });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to disconnect LinkedIn';
      dispatch({ type: 'LINKEDIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'LINKEDIN_RESET_ERROR' });
  }, []);

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      ...state,
      checkConnection,
      connectLinkedIn,
      refreshToken,
      disconnectLinkedIn,
      clearError,
    }),
    [state, checkConnection, connectLinkedIn, refreshToken, disconnectLinkedIn, clearError]
  );
};

