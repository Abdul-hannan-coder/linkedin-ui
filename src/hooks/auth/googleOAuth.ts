// Google OAuth Handler

import { setAuthToken } from './api';

/**
 * Initiate Google OAuth login flow
 * 
 * According to the backend flow:
 * - redirect_uri should be a PATH (e.g., "/dashboard"), not a full URL
 * - origin should be the frontend domain (e.g., "https://myapp.com")
 * - Backend will redirect to Google, then back to callback, then to frontend with token in URL
 * 
 * @param redirectUri - Path where user should land after login (e.g., "/dashboard")
 */
export const initiateGoogleOAuth = (redirectUri: string = '/dashboard'): void => {
  if (typeof window === 'undefined') {
    throw new Error('Google OAuth can only be initiated in the browser');
  }

  // Get current origin (frontend domain)
  const origin = window.location.origin;
  
  // Ensure redirect_uri is a path (starts with /)
  const redirectPath = redirectUri.startsWith('/') ? redirectUri : `/${redirectUri}`;

  // Build query parameters
  const params = new URLSearchParams();
  params.append('redirect_uri', redirectPath);
  params.append('origin', origin);

  // Redirect to backend login endpoint
  // Backend will handle OAuth flow and redirect back to frontend with token
  const authUrl = `https://backend.postsiva.com/auth/google/login?${params.toString()}`;
  
  // Simple redirect - backend handles everything
  window.location.href = authUrl;
};

/**
 * Extract and handle Google OAuth token from URL query parameters
 * This should be called on pages that receive OAuth redirects
 * 
 * @returns Object with success status and extracted data
 */
export const extractGoogleOAuthTokenFromUrl = (): { success: boolean; token?: string; user?: string; email?: string } => {
  if (typeof window === 'undefined') {
    return { success: false };
  }

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const user = urlParams.get('user');
  const email = urlParams.get('email');
  const success = urlParams.get('success') === 'true';

  if (success && token) {
    // Store token in localStorage
    setAuthToken(token);
    
    // Remove token from URL for security (clean URL)
    const currentPath = window.location.pathname;
    window.history.replaceState({}, document.title, currentPath);

    return {
      success: true,
      token,
      user: user || undefined,
      email: email || undefined,
    };
  }

  return { success: false };
};

/**
 * Handle Google OAuth callback (called from callback page)
 * Extracts token from URL query parameters and stores it
 * @deprecated Use extractGoogleOAuthTokenFromUrl instead
 */
export const handleGoogleOAuthCallback = (): { success: boolean; token?: string; user?: string; email?: string } => {
  return extractGoogleOAuthTokenFromUrl();
};
