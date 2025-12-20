// LinkedIn Reducer

import { LinkedInState, LinkedInAction } from './types';

export const initialState: LinkedInState = {
  isConnected: false,
  isLoading: false,
  error: null,
  tokenData: null,
};

export const linkedInReducer = (
  state: LinkedInState,
  action: LinkedInAction
): LinkedInState => {
  switch (action.type) {
    case 'LINKEDIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LINKEDIN_SUCCESS':
      return {
        ...state,
        isConnected: true,
        isLoading: false,
        error: null,
        tokenData: action.payload,
      };

    case 'LINKEDIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isConnected: false,
        error: action.payload,
        tokenData: null,
      };

    case 'LINKEDIN_DISCONNECT':
      return {
        ...initialState,
      };

    case 'LINKEDIN_RESET_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

