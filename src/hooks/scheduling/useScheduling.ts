// Custom React Hook for Scheduling

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  getScheduledPosts,
  createScheduledTextPost,
  createScheduledImagePost,
  createScheduledMultiImagePost,
  createScheduledVideoPost,
  updateScheduledPost,
  cancelScheduledPost,
} from './api';
import {
  CreateScheduledPostRequest,
  SchedulingState,
} from './types';

const initialState: SchedulingState = {
  scheduledPosts: [],
  isLoading: false,
  isCreating: false,
  error: null,
};

export const useScheduling = () => {
  const [state, setState] = useState<SchedulingState>(initialState);
  const initializedRef = useRef(false);

  /**
   * Load scheduled posts
   */
  const loadScheduledPosts = useCallback(async (params?: {
    platform?: 'linkedin';
    status?: 'scheduled' | 'published' | 'failed';
  }) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await getScheduledPosts({
        platform: 'linkedin',
        status: 'scheduled',
        ...params,
      });

      setState((prev) => ({
        ...prev,
        scheduledPosts: response.data.scheduled_posts || [],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load scheduled posts';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  /**
   * Create scheduled post
   */
  const createScheduledPost = useCallback(async (data: CreateScheduledPostRequest): Promise<void> => {
    setState((prev) => ({ ...prev, isCreating: true, error: null }));

    try {
      const visibility = data.visibility.toUpperCase() as 'PUBLIC' | 'CONNECTIONS';

      switch (data.post_type) {
        case 'text':
          await createScheduledTextPost({
            text: data.text,
            visibility,
            scheduled_time: data.scheduled_time,
          });
          break;

        case 'image':
          if (!data.media_ids?.[0]) {
            throw new Error('Image ID is required for image posts');
          }
          await createScheduledImagePost({
            image_id: data.media_ids[0],
            text: data.text,
            visibility,
            scheduled_time: data.scheduled_time,
          });
          break;

        case 'carousel':
          if (!data.media_ids || data.media_ids.length < 2) {
            throw new Error('At least 2 image IDs required for carousel posts');
          }
          await createScheduledMultiImagePost({
            image_ids: data.media_ids,
            text: data.text,
            visibility,
            scheduled_time: data.scheduled_time,
          });
          break;

        case 'video':
          if (!data.media_ids?.[0]) {
            throw new Error('Video ID is required for video posts');
          }
          await createScheduledVideoPost({
            video_id: data.media_ids[0],
            text: data.text,
            title: data.title || data.text.split('\n')[0] || 'Video Post',
            visibility,
            scheduled_time: data.scheduled_time,
          });
          break;

        default:
          throw new Error(`Unknown post type: ${data.post_type}`);
      }

      // Refresh the list after successful creation
      await loadScheduledPosts();
      
      setState((prev) => ({ ...prev, isCreating: false }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create scheduled post';
      setState((prev) => ({
        ...prev,
        isCreating: false,
        error: errorMessage,
      }));
      throw error; // Re-throw so UI can handle it
    }
  }, [loadScheduledPosts]);

  /**
   * Update scheduled post
   */
  const updateScheduledPostItem = useCallback(async (
    id: string,
    updates: {
      scheduled_time?: string;
      text?: string;
      visibility?: 'public' | 'connections';
    }
  ): Promise<void> => {
    try {
      const updateData: {
        scheduled_time?: string;
        post_data?: {
          text?: string;
          visibility?: 'PUBLIC' | 'CONNECTIONS';
        };
      } = {};

      if (updates.scheduled_time) {
        updateData.scheduled_time = updates.scheduled_time;
      }

      if (updates.text || updates.visibility) {
        updateData.post_data = {};
        if (updates.text) {
          updateData.post_data.text = updates.text;
        }
        if (updates.visibility) {
          updateData.post_data.visibility = updates.visibility.toUpperCase() as 'PUBLIC' | 'CONNECTIONS';
        }
      }

      await updateScheduledPost(id, updateData);
      
      // Refresh the list after successful update
      await loadScheduledPosts();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update scheduled post';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      throw error;
    }
  }, [loadScheduledPosts]);

  /**
   * Cancel scheduled post
   */
  const cancelScheduledPostItem = useCallback(async (id: string): Promise<void> => {
    try {
      await cancelScheduledPost(id);
      
      // Refresh the list after successful cancellation
      await loadScheduledPosts();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to cancel scheduled post';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      throw error;
    }
  }, [loadScheduledPosts]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Initial load
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    loadScheduledPosts();
  }, [loadScheduledPosts]);

  return {
    ...state,
    loadScheduledPosts,
    createScheduledPost,
    updateScheduledPostItem,
    cancelScheduledPostItem,
    clearError,
  };
};

