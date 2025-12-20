// Custom React Hook for Storage Management

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  getMedia,
  uploadMedia,
  deleteMedia,
  bulkDeleteMedia,
  cleanupMedia,
} from './api';
import {
  MediaFilter,
  StorageState,
} from './types';

const initialState: StorageState = {
  media: [],
  isLoading: false,
  isUploading: false,
  error: null,
  filter: 'all',
  pagination: {
    total: 0,
    limit: 12,
    offset: 0,
    count: 0,
    hasMore: false,
  },
};

export const useStorage = () => {
  const [state, setState] = useState<StorageState>(initialState);
  const initializedRef = useRef(false);
  const filterRef = useRef<MediaFilter>('all');
  const paginationRef = useRef(initialState.pagination);
  const isLoadingRef = useRef(false);

  // Keep refs in sync with state (update refs directly in setState callbacks to avoid dependency issues)
  // We'll update refs inline in setState calls, no need for separate useEffect

  /**
   * Load media with current filter and pagination
   */
  const loadMedia = useCallback(async (loadMore = false, filterOverride?: MediaFilter) => {
    setState((prev) => {
      const currentFilter = filterOverride !== undefined ? filterOverride : filterRef.current;
      const currentPagination = paginationRef.current;
      const params = {
        media_type: currentFilter === 'all' ? undefined : currentFilter,
        limit: currentPagination.limit,
        offset: loadMore ? currentPagination.offset + currentPagination.count : 0,
      };

      // Start async fetch
      getMedia(params)
        .then((response) => {
          setState((currentState) => {
            const updatedMedia = loadMore ? [...currentState.media, ...response.media] : response.media;
            const newPagination = {
              total: response.total,
              limit: response.limit,
              offset: response.offset,
              count: response.count,
              hasMore: response.offset + response.count < response.total,
            };
            
            // Update refs
            filterRef.current = currentFilter;
            paginationRef.current = newPagination;
            isLoadingRef.current = false;
            
            return {
              ...currentState,
              media: updatedMedia,
              isLoading: false,
              filter: currentFilter,
              pagination: newPagination,
            };
          });
        })
        .catch((error) => {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to load media';
          setState((currentState) => {
            isLoadingRef.current = false;
            return {
              ...currentState,
              isLoading: false,
              error: errorMessage,
            };
          });
        });

      // Update refs and return loading state immediately
      isLoadingRef.current = true;
      return { ...prev, isLoading: true, error: null };
    });
  }, []);

  /**
   * Upload file(s)
   */
  const uploadFile = useCallback(async (files: File[]): Promise<void> => {
    if (files.length === 0) return;

    setState((prev) => ({ ...prev, isUploading: true, error: null }));

    try {
      const uploadPromises = files.map((file) => {
        const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
        return uploadMedia(file, mediaType);
      });

      await Promise.all(uploadPromises);
      
      // Refresh media list after successful upload
      await loadMedia(false);
      
      setState((prev) => ({ ...prev, isUploading: false }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload file';
      setState((prev) => ({
        ...prev,
        isUploading: false,
        error: errorMessage,
      }));
      throw error; // Re-throw so UI can handle it
    }
  }, [loadMedia]);

  /**
   * Delete single media
   */
  const deleteMediaItem = useCallback(async (mediaId: string): Promise<void> => {
    try {
      await deleteMedia(mediaId);
      setState((prev) => {
        const newPagination = {
          ...prev.pagination,
          total: prev.pagination.total - 1,
          count: prev.pagination.count - 1,
        };
        paginationRef.current = newPagination;
        return {
          ...prev,
          media: prev.media.filter((item) => item.media_id !== mediaId),
          pagination: newPagination,
        };
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete media';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  /**
   * Bulk delete media
   */
  const bulkDelete = useCallback(async (mediaIds: string[]): Promise<void> => {
    if (mediaIds.length === 0) return;

    try {
      await bulkDeleteMedia(mediaIds);
      setState((prev) => {
        const newPagination = {
          ...prev.pagination,
          total: prev.pagination.total - mediaIds.length,
          count: prev.pagination.count - mediaIds.length,
        };
        paginationRef.current = newPagination;
        return {
          ...prev,
          media: prev.media.filter((item) => !mediaIds.includes(item.media_id)),
          pagination: newPagination,
        };
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete media';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  /**
   * Cleanup expired media
   */
  const cleanup = useCallback(async (): Promise<void> => {
    try {
      await cleanupMedia();
      // Refresh media list after cleanup
      await loadMedia(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to cleanup expired media';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      throw error;
    }
  }, [loadMedia]);

  /**
   * Set filter and reload media
   */
  const setFilter = useCallback((filter: MediaFilter) => {
    filterRef.current = filter;
    setState((prev) => ({ ...prev, filter }));
    // Media will be reloaded by the useEffect below
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * Load more media (pagination)
   */
  const loadMore = useCallback(() => {
    if (!paginationRef.current.hasMore || isLoadingRef.current) {
      return;
    }
    loadMedia(true);
  }, [loadMedia]);

  // Initial load
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    loadMedia(false);
  }, []); // Only run once on mount

  // Reload when filter changes (but skip initial mount)
  useEffect(() => {
    if (!initializedRef.current) return;
    loadMedia(false, state.filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filter]); // loadMedia is stable (empty deps), only react to filter changes

  return {
    ...state,
    loadMedia,
    uploadFile,
    deleteMediaItem,
    bulkDelete,
    cleanup,
    setFilter,
    clearError,
    loadMore,
  };
};
