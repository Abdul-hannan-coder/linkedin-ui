// Google OAuth Popup Handler

import { getToken } from './api';

/**
 * Open Google OAuth popup and handle callback
 */
export const initiateGoogleOAuth = async (
  onSuccess?: () => void,
  onError?: (error: Error) => void,
  redirectUri?: string
): Promise<void> => {
  try {
    // Get current origin for redirect_uri
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://linkedin-sooty-five.vercel.app';
    const finalRedirectUri = redirectUri || '/dashboard';

    // The callback page URL where backend should redirect after OAuth
    // This callback page will handle closing the popup and notifying the parent window
    const callbackUrl = `${currentOrigin}/auth/google/callback?redirect_uri=${encodeURIComponent(finalRedirectUri)}`;

    // Always use backend endpoint with redirect_uri and origin parameters
    // redirect_uri should point to our callback page, which will handle popup closure
    const params = new URLSearchParams();
    params.append('redirect_uri', callbackUrl);
    params.append('origin', currentOrigin);
    
    // Always use backend login endpoint with redirect_uri and origin parameters
    // This ensures the backend knows where to redirect after OAuth completes
    const authUrl = `https://backend.postsiva.com/auth/google/login?${params.toString()}`;




    
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
    
    // Listen for messages from popup (callback page)
    const handleMessage = (event: MessageEvent) => {
      // Verify message is from same origin
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
        // OAuth successful
        clearTimeout(timeout);
        cleanup();
        
        // Wait a bit for token to be set
        setTimeout(() => {
          // For unauthenticated users, check if token was set (login successful)
          if (!initialToken) {
            const newToken = getToken();
            if (newToken) {
              // Token was set - login successful
              onSuccess?.();
            } else {
              // Token might still be setting, try again
              setTimeout(() => {
                const finalToken = getToken();
                if (finalToken) {
                  onSuccess?.();
                } else {
                  onError?.(new Error('Google OAuth completed but no token received'));
                }
              }, 1000);
            }
          } else {
            // For authenticated users, just call success (account linking)
            onSuccess?.();
          }
        }, 500);
      } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
        // OAuth error
        clearTimeout(timeout);
        cleanup();
        onError?.(new Error(event.data.error || 'Google OAuth failed'));
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Simple popup closure detection (fallback)
    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearTimeout(timeout);
        cleanup();
        
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

    // Cleanup function
    const cleanup = () => {
      clearInterval(checkPopup);
      window.removeEventListener('message', handleMessage);
    };

    // Timeout after 5 minutes
    const timeout = setTimeout(() => {
      if (!popup.closed) {
        popup.close();
      }
      cleanup();
      onError?.(new Error('OAuth flow timed out'));
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
