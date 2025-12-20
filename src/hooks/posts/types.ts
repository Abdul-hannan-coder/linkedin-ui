// Post Types and Interfaces

export type PostType = "text" | "image" | "multiple" | "video";
export type Visibility = "public" | "connections";

export interface PostData {
  text: string;
  visibility?: Visibility;
}

export interface ImagePostData extends PostData {
  image_url: string;
}

export interface MultiImagePostData extends PostData {
  image_urls: string[];
}

export interface VideoPostData extends PostData {
  title: string;
  video_url: string;
}

// API Response Types
export interface PostResponse {
  success: boolean;
  message: string;
  post?: {
    post_id: string;
    text: string;
    visibility: string;
    post_url: string;
    posted_at: string;
  };
  error?: string;
}

export interface MediaUploadResponse {
  success: boolean;
  message?: string;
  url: string;
  media_id?: string;
  error?: string;
}

// Post State Types
export interface PostState {
  isPosting: boolean;
  isUploading: boolean;
  uploadProgress: Record<string, number>;
  error: string | null;
  success: boolean;
  postId: string | null;
}

// Post Action Types
export type PostAction =
  | { type: 'POST_START' }
  | { type: 'UPLOAD_START'; payload: { fileIndex: string } }
  | { type: 'UPLOAD_PROGRESS'; payload: { fileIndex: string; progress: number } }
  | { type: 'POST_SUCCESS'; payload: { postId: string } }
  | { type: 'POST_FAILURE'; payload: string }
  | { type: 'POST_RESET' }
  | { type: 'POST_RESET_ERROR' };

