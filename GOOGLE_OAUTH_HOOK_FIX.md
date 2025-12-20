# Google OAuth Hook - Corrections for Cursor

## 🎯 **Issues in Current Hook**

Your current Google OAuth hook has these problems:

1. **Wrong Flow**: Assumes Google OAuth changes PostSiva token (it doesn't)
2. **Complex Logic**: Unnecessary token change detection
3. **Hardcoded URL**: Manual OAuth URL construction instead of using backend

---

## ✅ **Backend API Analysis**

**Tested endpoints:**
- `GET /auth/google/debug` → Returns `generated_auth_url` ✅
- `GET /auth/google/status` → Returns OAuth configuration ✅
- Callback: `https://backend.postsiva.com/auth/google/callback` ✅

**OAuth Flow:**
1. User must be logged in to PostSiva first
2. Get OAuth URL from backend
3. Open popup with OAuth URL
4. User completes OAuth on Google
5. Google redirects to backend callback
6. Backend processes and links Google account
7. Popup closes = success

---

## 🔧 **Corrected Hook**

Replace your entire `googleOAuth.ts` file with this:

```typescript
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
    if (!token) {
      throw new Error('User must be logged in to link Google account');
    }

    // Get OAuth URL from backend (not hardcoded)
    const debug = await getGoogleOAuthDebug();
    const authUrl = debug.generated_auth_url;

    if (!authUrl) {
      throw new Error('Failed to get Google OAuth URL from backend');
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

    // Simple popup closure detection
    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        // Wait for backend to process callback
        setTimeout(() => {
          onSuccess?.();
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
```

---

## 🎯 **Key Changes Made**

### **❌ Removed:**
- Complex token change detection logic
- Storage event listeners
- Manual OAuth URL construction
- State parameter handling
- Cross-origin popup URL checking

### **✅ Added:**
- Simple backend OAuth URL fetching
- Basic popup closure detection
- Proper error handling
- User authentication check

---

## 📋 **What This Does**

1. **Checks user is logged in** (required for Google OAuth linking)
2. **Gets OAuth URL from backend** (`/auth/google/debug`)
3. **Opens popup** with backend-generated URL
4. **Waits for popup to close** (= OAuth completed)
5. **Calls success callback** after short delay

---

## 🚀 **Usage**

```typescript
// In your component
const handleGoogleLogin = () => {
  initiateGoogleOAuth(
    () => {
      console.log('Google OAuth successful!');
      // Refresh user data or redirect
    },
    (error) => {
      console.error('Google OAuth failed:', error.message);
    }
  );
};
```

**This simplified version works with your backend's OAuth flow!** 🎯
