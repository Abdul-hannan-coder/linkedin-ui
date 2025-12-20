// Storage Types and Interfaces

export type MediaFilter = 'all' | 'image' | 'video';

export interface MediaItem {
  media_id: string;
  media_type: 'image' | 'video';
  platform: string | null;
  public_url: string;
  filename: string;
  file_size: number;
  status: 'uploaded' | 'posted';
  uploaded_at: string;
  expires_at: string;
}

export interface MediaResponse {
  success: boolean;
  media: MediaItem[];
  total: number;
  limit: number;
  offset: number;
  count: number;
}

export interface MediaUploadResponse {
  success: boolean;
  message?: string;
  media_id?: string;
  public_url?: string;
  filename?: string;
  file_size?: number;
  media_type?: string;
  error?: string;
}

export interface BulkDeleteResponse {
  success: boolean;
  message: string;
  deleted_count?: number;
  error?: string;
}

export interface CleanupResponse {
  success: boolean;
  message: string;
  deleted_count?: number;
  error?: string;
}

// Storage State Types
export interface StorageState {
  media: MediaItem[];
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  filter: MediaFilter;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    count: number;
    hasMore: boolean;
  };
}

