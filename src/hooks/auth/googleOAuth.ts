// Google OAuth Popup Handler

import { getGoogleOAuthDebug, getToken } from './api';

/**
 * Open Google OAuth popup and handle callback
 */
export const initiateGoogleOAuth = async (
  onSuccess?: () => void,
  onError?: (error: Error) => void
): Promise<void> => {
  try {
    const token = getToken();
    let authUrl: string;

    if (token) {
      // User is authenticated - get OAuth URL from backend (for linking account)
      try {
        const debug = await getGoogleOAuthDebug();
        authUrl = debug.generated_auth_url;
        
        if (!authUrl) {
          throw new Error('Failed to get Google OAuth URL from backend');
        }
      } catch {
        throw new Error('Failed to get Google OAuth URL from backend');
      }
    } else {
      // User is not authenticated - construct OAuth URL directly (for login/signup)
      // Using known Google OAuth configuration
      const clientId = '132195997917-ehh86lrhph7ps16enls8096abjr4kr55.apps.googleusercontent.com';
      const redirectUri = encodeURIComponent('https://backend.postsiva.com/auth/google/callback');
      const scope = encodeURIComponent('openid email profile');
      
      authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline&prompt=consent`;
    }

    // Open popup window
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup = window.open(
      authUrl,
      'google-oauth',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=yes,status=yes`
    );

    if (!popup) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }

    // Store initial token state
    const initialToken = getToken();
    
    // Simple popup closure detection
    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        // Wait for backend to process callback
        setTimeout(() => {
          // For unauthenticated users, check if token was set (login successful)
          if (!initialToken) {
            const newToken = getToken();
            if (newToken) {
              // Token was set - login successful
              onSuccess?.();
            } else {
              // No token - user might have cancelled
              onError?.(new Error('Google OAuth was cancelled or failed'));
            }
          } else {
            // For authenticated users, just call success (account linking)
            onSuccess?.();
          }
        }, 1500);
      }
    }, 500);

    // Timeout after 5 minutes
    setTimeout(() => {
      if (!popup.closed) {
        popup.close();
        clearInterval(checkPopup);
        onError?.(new Error('OAuth flow timed out'));
      }
    }, 5 * 60 * 1000);

  } catch (error) {
    onError?.(error instanceof Error ? error : new Error('Failed to initiate Google OAuth'));
  }
};

/**
 * Handle Google OAuth callback (called from callback page)
 */
export const handleGoogleOAuthCallback = async (): Promise<void> => {
  // The callback is handled by the backend API
  // This function can be empty or used for additional client-side logic
  const token = getToken();
  if (!token) {
    throw new Error('OAuth callback failed - no token found');
  }
};
