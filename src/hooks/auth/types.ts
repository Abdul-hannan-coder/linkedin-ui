// Auth Types and Interfaces

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  full_name: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Auth Action Types
export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_RESET_ERROR' }
  | { type: 'SET_USER'; payload: User };

// Google OAuth Types
export interface GoogleOAuthStatus {
  google_oauth_configured: boolean;
  redirect_uri: string;
  client_id: string;
  client_secret_configured: boolean;
  login_url: string;
  callback_url: string;
}

export interface GoogleOAuthDebug {
  status: string;
  configuration: {
    client_id: string;
    client_secret_configured: boolean;
    redirect_uri: string;
  };
  generated_auth_url: string;
  message: string;
}

