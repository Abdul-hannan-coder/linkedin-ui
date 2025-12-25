// Auth API Functions

import { LoginRequest, SignupRequest, AuthResponse, User, GoogleOAuthStatus, GoogleOAuthDebug } from './types';

const BASE_URL = 'https://backend.postsiva.com';

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

// Helper function to set auth token in localStorage
const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

// Helper function to remove auth token from localStorage
const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
};

// Helper function for API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(errorData.message || 'An error occurred');
  }

  return response.json();
};

/**
 * Login user and get access token
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  // Store token in localStorage
  if (response.access_token) {
    setAuthToken(response.access_token);
  }
  
  return response;
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  return apiRequest<User>('/auth/me', {
    method: 'GET',
  });
};

/**
 * Sign up new user
 */
export const signup = async (userData: SignupRequest): Promise<AuthResponse> => {
  const response = await apiRequest<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  
  // Store token in localStorage
  if (response.access_token) {
    setAuthToken(response.access_token);
  }
  
  return response;
};

/**
 * Logout user (clears token from localStorage)
 */
export const logout = (): void => {
  removeAuthToken();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

/**
 * Get stored auth token
 */
export const getToken = (): string | null => {
  return getAuthToken();
};

/**
 * Set auth token in localStorage
 */
export { setAuthToken };

// Export token management functions
export const authTokenUtils = {
  get: getAuthToken,
  set: setAuthToken,
  remove: removeAuthToken,
  isAuthenticated,
};

/**
 * Get Google OAuth login URL (returns redirect URL)
 */
export const getGoogleOAuthLoginUrl = async (): Promise<string> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required for Google OAuth');
  }

  const response = await fetch(`${BASE_URL}/auth/google/login`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    redirect: 'manual', // Don't follow redirect, we want the URL
  });

  // Get redirect URL from Location header
  const location = response.headers.get('Location');
  if (location) {
    return location;
  }

  // If no Location header, try debug endpoint
  const debug = await getGoogleOAuthDebug();
  return debug.generated_auth_url;
};

/**
 * Get Google OAuth debug information (includes auth URL)
 */
export const getGoogleOAuthDebug = async (queryParams?: string): Promise<GoogleOAuthDebug> => {
  const endpoint = queryParams ? `/auth/google/debug?${queryParams}` : '/auth/google/debug';
  return apiRequest<GoogleOAuthDebug>(endpoint, {
    method: 'GET',
  });
};

/**
 * Check Google OAuth status
 */
export const checkGoogleOAuthStatus = async (): Promise<GoogleOAuthStatus> => {
  return apiRequest<GoogleOAuthStatus>('/auth/google/status', {
    method: 'GET',
  });
};

