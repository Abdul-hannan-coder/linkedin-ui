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
   * Upload multiple files - Returns media_ids
   */
  const uploadFiles = useCallback(async (files: File[], mediaType: 'image' | 'video'): Promise<string[]> => {
    if (files.length === 0) return [];

    dispatch({ type: 'POST_START' });

    const uploadPromises = files.map(async (file, index) => {
      const fileIndex = index.toString();
      dispatch({ type: 'UPLOAD_START', payload: { fileIndex } });

      // Simulate progress for better UX (since we don't have real progress events)
      const progressInterval = setInterval(() => {
        dispatch({
          type: 'UPLOAD_PROGRESS',
          payload: { fileIndex, progress: 50 },
        });
      }, 200);

      try {
        const mediaId = await uploadMedia(file, mediaType);

        clearInterval(progressInterval);
        dispatch({
          type: 'UPLOAD_PROGRESS',
          payload: { fileIndex, progress: 100 },
        });

        return { success: true, mediaId, index };
      } catch (error) {
        clearInterval(progressInterval);
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        return { success: false, error: errorMessage, index };
      }
    });

    const results = await Promise.all(uploadPromises);
    
    // Check for any failures
    const failures = results.filter(r => !r.success);
    if (failures.length > 0) {
      const errorMessages = failures.map(f => `File ${f.index + 1}: ${f.error}`).join(', ');
      throw new Error(`Failed to upload ${failures.length} file(s): ${errorMessages}`);
    }
    
    // Extract media IDs and ensure all succeeded
    const mediaIds = results
      .filter(r => r.success)
      .map(r => (r as { success: true; mediaId: string }).mediaId);
    
    if (mediaIds.length !== files.length) {
      throw new Error(`Only ${mediaIds.length} out of ${files.length} files uploaded successfully`);
    }
    
    return mediaIds;
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

            const imageIds = await uploadFiles([files[0]], 'image');
            
            if (!imageIds[0]) {
              throw new Error('Failed to get image ID from upload');
            }

            const data: ImagePostData = {
              text: content.trim() || '', // Ensure text is always provided, even if empty
              image_id: imageIds[0],
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

            const imageIds = await uploadFiles(files, 'image');
            
            // Validate that we got all the image IDs
            if (!imageIds || imageIds.length === 0) {
              throw new Error('Failed to upload images');
            }
            if (imageIds.length < 2) {
              throw new Error(`Only ${imageIds.length} image(s) uploaded successfully. At least 2 images required.`);
            }
            if (imageIds.length !== files.length) {
              throw new Error(`Only ${imageIds.length} out of ${files.length} images uploaded successfully.`);
            }
            
            const data: MultiImagePostData = {
              text: content,
              image_ids: imageIds,
              visibility,
            };
            result = await createMultiImagePost(data);
            break;
          }

          case 'video': {
            if (files.length === 0) {
              throw new Error('Video file is required for video posts');
            }

            const videoIds = await uploadFiles([files[0]], 'video');
            
            if (!videoIds[0]) {
              throw new Error('Failed to get video ID from upload');
            }
            
            const title = content.split('\n')[0] || 'Video Post';
            const data: VideoPostData = {
              text: content,
              title,
              video_id: videoIds[0],
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

