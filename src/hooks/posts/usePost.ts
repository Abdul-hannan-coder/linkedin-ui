// Custom React Hook for LinkedIn Posting

'use client';

import { useReducer, useCallback } from 'react';
import { postReducer, initialState } from './reducer';
import {
  uploadMedia,
  createTextPost,
  createImagePost,
  createMultiImagePost,
  createVideoPost,
} from './api';
import {
  PostType,
  PostData,
  ImagePostData,
  MultiImagePostData,
  VideoPostData,
  PostResponse,
} from './types';

export const usePost = () => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  /**
   * Upload multiple files
   */
  const uploadFiles = useCallback(async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    dispatch({ type: 'POST_START' });

    const uploadPromises = files.map(async (file, index) => {
      const fileIndex = index.toString();
      dispatch({ type: 'UPLOAD_START', payload: { fileIndex } });

      try {
        // Simulate progress for better UX (since we don't have real progress events)
        const progressInterval = setInterval(() => {
          dispatch({
            type: 'UPLOAD_PROGRESS',
            payload: { fileIndex, progress: 50 },
          });
        }, 200);

        const url = await uploadMedia(file);

        clearInterval(progressInterval);
        dispatch({
          type: 'UPLOAD_PROGRESS',
          payload: { fileIndex, progress: 100 },
        });

        return url;
      } catch (error) {
        throw error;
      }
    });

    try {
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      throw error;
    }
  }, []);

  /**
   * Create a LinkedIn post
   */
  const createPost = useCallback(
    async (
      postType: PostType,
      content: string,
      files: File[] = [],
      visibility: 'public' | 'connections' = 'public'
    ): Promise<PostResponse> => {
      dispatch({ type: 'POST_START' });
      dispatch({ type: 'POST_RESET_ERROR' });

      try {
        let result: PostResponse;

        switch (postType) {
          case 'text': {
            const data: PostData = {
              text: content,
              visibility,
            };
            result = await createTextPost(data);
            break;
          }

          case 'image': {
            if (files.length === 0) {
              throw new Error('Image file is required for image posts');
            }

            const imageUrls = await uploadFiles([files[0]]);
            
            if (!imageUrls[0]) {
              throw new Error('Failed to get image URL from upload');
            }

            const data: ImagePostData = {
              text: content.trim() || '', // Ensure text is always provided, even if empty
              image_url: imageUrls[0],
              visibility,
            };
            
            result = await createImagePost(data);
            break;
          }

          case 'multiple': {
            if (files.length === 0) {
              throw new Error('At least one image file is required');
            }
            if (files.length < 2) {
              throw new Error('Multiple images post requires at least 2 images');
            }
            if (files.length > 20) {
              throw new Error('Maximum 20 images allowed');
            }

            const imageUrls = await uploadFiles(files);
            const data: MultiImagePostData = {
              text: content,
              image_urls: imageUrls,
              visibility,
            };
            result = await createMultiImagePost(data);
            break;
          }

          case 'video': {
            if (files.length === 0) {
              throw new Error('Video file is required for video posts');
            }

            const videoUrls = await uploadFiles([files[0]]);
            const title = content.split('\n')[0] || 'Video Post';
            const data: VideoPostData = {
              text: content,
              title,
              video_url: videoUrls[0],
              visibility,
            };
            result = await createVideoPost(data);
            break;
          }

          default:
            throw new Error(`Unknown post type: ${postType}`);
        }

        if (result.success && result.post?.post_id) {
          dispatch({
            type: 'POST_SUCCESS',
            payload: { postId: result.post.post_id },
          });
        } else {
          throw new Error(result.error || 'Failed to create post');
        }

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to create post';
        dispatch({ type: 'POST_FAILURE', payload: errorMessage });
        throw error;
      }
    },
    [uploadFiles]
  );

  /**
   * Reset post state
   */
  const resetPost = useCallback(() => {
    dispatch({ type: 'POST_RESET' });
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'POST_RESET_ERROR' });
  }, []);

  return {
    ...state,
    createPost,
    uploadFiles,
    resetPost,
    clearError,
  };
};

