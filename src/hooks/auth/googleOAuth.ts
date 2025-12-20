// Google OAuth Popup Handler

import { getGoogleOAuthLoginUrl, getGoogleOAuthDebug, getToken } from './api';

/**
 * Open Google OAuth popup and handle callback
 */
export const initiateGoogleOAuth = async (
  onSuccess?: () => void,
  onError?: (error: Error) => void
): Promise<void> => {
  try {
    // Get Google OAuth URL
    let authUrl: string;
    const token = getToken();
    
    if (token) {
      // User is authenticated, use authenticated endpoints
      try {
        // Try to get URL from login endpoint (preferred)
        authUrl = await getGoogleOAuthLoginUrl();
      } catch (error) {
        // Fallback to debug endpoint if login endpoint fails
        console.warn('Failed to get OAuth URL from login endpoint, using debug endpoint');
        const debug = await getGoogleOAuthDebug();
        authUrl = debug.generated_auth_url;
      }
    } else {
      // User is not authenticated - construct OAuth URL directly
      // Using known Google OAuth configuration from the API
      const clientId = '132195997917-ehh86lrhph7ps16enls8096abjr4kr55.apps.googleusercontent.com';
      const redirectUri = encodeURIComponent('https://backend.postsiva.com/auth/google/callback');
      const scope = encodeURIComponent('openid email profile');
      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Store state in sessionStorage for verification
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('google_oauth_state', state);
      }
      
      authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline&prompt=consent&state=${state}`;
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

    // Store initial token state to detect changes
    const initialToken = getToken();
    let tokenCheckCount = 0;
    const maxTokenChecks = 120; // Check for up to 60 seconds (500ms * 120)
    let isCompleted = false;
    
    // Listen for storage events (in case token is set from popup)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' && e.newValue && e.newValue !== initialToken && !isCompleted) {
        isCompleted = true;
        if (!popup.closed) {
          popup.close();
        }
        clearInterval(checkPopup);
        window.removeEventListener('storage', handleStorageChange);
        onSuccess?.();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Poll for popup closure or token change
    const checkPopup = setInterval(() => {
      if (isCompleted) {
        clearInterval(checkPopup);
        window.removeEventListener('storage', handleStorageChange);
        return;
      }
      tokenCheckCount++;
      
      // Check if token has been set (for new logins) or changed (for existing users)
      const currentToken = getToken();
        if (currentToken) {
          // For unauthenticated users, any token means success
          // For authenticated users, token should already exist
          if (!initialToken || currentToken !== initialToken) {
            // Token was set or changed - OAuth succeeded
            isCompleted = true;
            if (!popup.closed) {
              popup.close();
            }
            clearInterval(checkPopup);
            window.removeEventListener('storage', handleStorageChange);
            onSuccess?.();
            return;
          }
        }
      
      if (popup.closed) {
        if (!isCompleted) {
          isCompleted = true;
          clearInterval(checkPopup);
          window.removeEventListener('storage', handleStorageChange);
          // Popup closed - check final token state
          const finalToken = getToken();
          if (finalToken && finalToken !== initialToken) {
            // Token exists and changed - OAuth likely succeeded
            onSuccess?.();
          } else if (finalToken && !initialToken) {
            // Token was set (new login)
            onSuccess?.();
          } else {
            // No token change - user might have cancelled or flow failed
            // Only show error if callback is provided, user might have just closed the popup
            if (onError && tokenCheckCount > 10) {
              // Only error if popup was open for a while (user actually attempted)
              onError(new Error('OAuth flow was cancelled or failed'));
            }
          }
        }
        return;
      }
      
      // Timeout check
      if (tokenCheckCount >= maxTokenChecks) {
        isCompleted = true;
        popup.close();
        clearInterval(checkPopup);
        window.removeEventListener('storage', handleStorageChange);
        onError?.(new Error('OAuth flow timed out'));
        return;
      }
      
      // Check if popup has navigated to callback URL (if accessible)
      try {
        const popupUrl = popup.location.href;
        if (popupUrl.includes('/auth/google/callback') || 
            popupUrl.includes('/dashboard') || 
            popupUrl.includes('/login')) {
          // Callback detected or redirected - wait a bit then check token
          setTimeout(() => {
            if (!isCompleted) {
              const callbackToken = getToken();
              if (callbackToken && callbackToken !== initialToken) {
                isCompleted = true;
                popup.close();
                clearInterval(checkPopup);
                window.removeEventListener('storage', handleStorageChange);
                onSuccess?.();
              }
            }
          }, 1500);
        }
      } catch (e) {
        // Cross-origin error - popup is on Google's domain, which is expected
        // Continue polling for token changes
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
export const handleGoogleOAuthCallback = async (code: string, state?: string): Promise<void> => {
  // The callback is handled by the backend API
  // We just need to verify the token was set
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('OAuth callback failed - no token received');
  }
};

