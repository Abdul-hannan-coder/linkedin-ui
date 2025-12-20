// Scheduling Types and Interfaces

export interface ScheduledPost {
  scheduled_post_id: string;
  platform: 'linkedin';
  post_type: 'text' | 'image' | 'video' | 'carousel';
  post_data: {
    text: string;
    visibility: 'PUBLIC' | 'CONNECTIONS';
    media_id?: string;
    image_ids?: string;
    video_id?: string;
    title?: string;
  };
  scheduled_time: string;
  scheduled_time_local: string;
  scheduled_time_formatted: string;
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
  published_post_id?: string;
  published_post_url?: string;
  error_message?: string;
  time_until_scheduled: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  media?: {
    media_count: number;
    media_urls: Array<{
      media_id: string;
      public_url: string;
      media_type: string;
      filename: string;
      file_size: number;
    }>;
  };
}

export interface ScheduledPostsResponse {
  success: boolean;
  message: string;
  data: {
    scheduled_posts: ScheduledPost[];
    total: number;
    platform?: string;
    status?: string;
  };
}

export interface CreateScheduledPostRequest {
  text: string;
  visibility: 'public' | 'connections';
  scheduled_time: string;
  post_type: 'text' | 'image' | 'carousel' | 'video';
  media_ids?: string[];
  title?: string;
}

export interface UpdateScheduledPostRequest {
  scheduled_time?: string;
  post_data?: {
    text?: string;
    visibility?: 'PUBLIC' | 'CONNECTIONS';
    media_id?: string;
    image_ids?: string;
    video_id?: string;
    title?: string;
  };
}

// Scheduling State Types
export interface SchedulingState {
  scheduledPosts: ScheduledPost[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
}

