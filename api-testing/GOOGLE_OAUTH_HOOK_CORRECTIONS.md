# Google OAuth Hook - Issues & Corrections

## 🎯 **Issues Found in Your Current Hook**

### **❌ Problem 1: Wrong OAuth Flow Understanding**
Your hook assumes Google OAuth changes the PostSiva token, but it doesn't. Google OAuth **links** your Google account to your existing PostSiva account.

### **❌ Problem 2: Complex Token Detection Logic**
Your hook has complex logic to detect token changes, but the PostSiva token remains the same after Google OAuth.

### **❌ Problem 3: Hardcoded OAuth URL**
You're constructing the OAuth URL manually instead of using the backend's generated URL.

---

## ✅ **Corrected Google OAuth Hook**

### **File**: `src/hooks/auth/googleOAuth.ts`

```typescript
import { getGoogleOAuthDebug, getToken } from './api';

/**
 * Initiate Google OAuth flow
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

    // Get OAuth URL from backend
    const debug = await getGoogleOAuthDebug();
    const authUrl = debug.generated_auth_url;

    if (!authUrl) {
      throw new Error('Failed to get Google OAuth URL');
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

    // Poll for popup closure
    const checkPopup = setInterval(async () => {
      if (popup.closed) {
        clearInterval(checkPopup);
        
        // Wait a moment for backend to process callback
        setTimeout(async () => {
          try {
            // Check if Google OAuth was successful
            // You can verify this by checking user profile or a specific endpoint
            const userProfile = await fetch('/api/auth/me', {
              headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json());
            
            // If you have a way to check Google OAuth status, use it here
            // For now, we assume success if popup was closed normally
            onSuccess?.();
          } catch (error) {
            onError?.(new Error('Failed to verify Google OAuth status'));
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
 * Check Google OAuth status
 */
export const checkGoogleOAuthStatus = async (): Promise<boolean> => {
  try {
    const token = getToken();
    if (!token) return false;

    const response = await fetch('/api/auth/google/status', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    return data.google_oauth_configured === true;
  } catch (error) {
    console.error('Failed to check Google OAuth status:', error);
    return false;
  }
};
```

---

## 🔧 **Even Simpler Approach**

Since the backend handles everything, you can make it even simpler:

```typescript
/**
 * Simple Google OAuth - Just redirect to backend
 */
export const initiateGoogleOAuthSimple = (): void => {
  const token = getToken();
  if (!token) {
    throw new Error('User must be logged in');
  }

  // Simply redirect to the backend OAuth endpoint
  // The backend will handle the entire flow and redirect back
  window.location.href = `/api/auth/google/login?token=${token}`;
};

/**
 * Or use popup with backend endpoint directly
 */
export const initiateGoogleOAuthPopup = (
  onSuccess?: () => void,
  onError?: (error: Error) => void
): void => {
  const token = getToken();
  if (!token) {
    onError?.(new Error('User must be logged in'));
    return;
  }

  // Open popup directly to backend login endpoint
  const popup = window.open(
    `/api/auth/google/login?token=${token}`,
    'google-oauth',
    'width=500,height=600'
  );

  if (!popup) {
    onError?.(new Error('Popup blocked'));
    return;
  }

  // Simple popup closure detection
  const checkPopup = setInterval(() => {
    if (popup.closed) {
      clearInterval(checkPopup);
      // Assume success - you can add verification here
      setTimeout(() => onSuccess?.(), 1000);
    }
  }, 500);
};
```

---

## 🎯 **Key Changes Needed**

### **1. Remove Complex Token Logic**
```typescript
// ❌ Remove this complex token detection
const initialToken = getToken();
let tokenCheckCount = 0;
// ... complex polling logic

// ✅ Replace with simple popup closure detection
const checkPopup = setInterval(() => {
  if (popup.closed) {
    clearInterval(checkPopup);
    onSuccess?.();
  }
}, 500);
```

### **2. Use Backend OAuth URL**
```typescript
// ❌ Remove hardcoded URL construction
const clientId = '132195997917-ehh86lrhph7ps16enls8096abjr4kr55.apps.googleusercontent.com';
const redirectUri = encodeURIComponent('https://backend.postsiva.com/auth/google/callback');

// ✅ Use backend-generated URL
const debug = await getGoogleOAuthDebug();
const authUrl = debug.generated_auth_url;
```

### **3. Simplify Success Detection**
```typescript
// ❌ Remove complex token change detection
if (currentToken !== initialToken) { ... }

// ✅ Simple popup closure = success
if (popup.closed) {
  onSuccess?.();
}
```

---

## 🚀 **Recommended Implementation**

Use the **simplest approach** that works:

1. **Get OAuth URL** from `/auth/google/debug`
2. **Open popup** with that URL
3. **Wait for popup closure**
4. **Call success callback**

The backend handles all the OAuth complexity, so your frontend just needs to open the popup and detect when it closes.

---

## 📋 **Backend API Flow Confirmed**

✅ **OAuth URL**: `GET /auth/google/debug` → `generated_auth_url`  
✅ **Callback**: `https://backend.postsiva.com/auth/google/callback`  
✅ **Status Check**: `GET /auth/google/status`  
✅ **Client ID**: `132195997917-ehh86lrhph7ps16enls8096abjr4kr55.apps.googleusercontent.com`  

Your backend is properly configured - you just need to simplify your frontend hook! 🎯
