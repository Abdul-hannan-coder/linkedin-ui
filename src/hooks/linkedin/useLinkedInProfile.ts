// Custom React Hook for LinkedIn Profile

'use client';

import { useState, useCallback } from 'react';
import { getLinkedInProfile } from './api';
import { LinkedInProfile, LinkedInProfileState } from './types';

const initialState: LinkedInProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

export const useLinkedInProfile = () => {
  const [state, setState] = useState<LinkedInProfileState>(initialState);

  /**
   * Fetch LinkedIn profile
   */
  const fetchProfile = useCallback(async (): Promise<LinkedInProfile | null> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const profile = await getLinkedInProfile();
      const lastUpdated = new Date().toISOString();
      
      setState({
        profile,
        isLoading: false,
        error: null,
        lastUpdated,
      });
      
      return profile;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch LinkedIn profile';
      
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      return null;
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    fetchProfile,
    clearError,
  };
};

