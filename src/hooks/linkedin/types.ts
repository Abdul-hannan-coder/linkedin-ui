// LinkedIn OAuth Types and Interfaces

export interface LinkedInTokenResponse {
  success: boolean;
  message: string;
  data: LinkedInTokenData;
}

export interface LinkedInTokenData {
  user_id: string;
  access_token: string;
  token_type: string;
  scope: string;
  expires_at: string;
  created_at: string;
  id: number;
  refresh_token: string;
  expires_in: number;
  linkedin_user_id: string;
  updated_at: string | null;
}

export interface LinkedInCreateTokenResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    message: string;
    user_id: string;
    auth_url: string;
    instructions: string;
  };
}

export interface LinkedInRefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
    expires_at: string;
    linkedin_user_id: string;
    user_id: string;
  };
}

export interface LinkedInState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  tokenData: LinkedInTokenData | null;
}

// LinkedIn Action Types
export type LinkedInAction =
  | { type: 'LINKEDIN_START' }
  | { type: 'LINKEDIN_SUCCESS'; payload: LinkedInTokenData }
  | { type: 'LINKEDIN_FAILURE'; payload: string }
  | { type: 'LINKEDIN_DISCONNECT' }
  | { type: 'LINKEDIN_RESET_ERROR' };

// LinkedIn Profile Types
export interface LinkedInLocale {
  language: string;
  country: string;
}

export interface LinkedInProfile {
  linkedin_user_id: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  email_verified: boolean;
  picture: string;
  locale: LinkedInLocale;
}

export interface LinkedInProfileResponse {
  success: boolean;
  message: string;
  profile: LinkedInProfile;
  source: string;
  last_updated: string;
  error: string | null;
}

export interface LinkedInProfileState {
  profile: LinkedInProfile | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

