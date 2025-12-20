// Post Reducer

import { PostState, PostAction } from './types';

export const initialState: PostState = {
  isPosting: false,
  isUploading: false,
  uploadProgress: {},
  error: null,
  success: false,
  postId: null,
};

export const postReducer = (
  state: PostState,
  action: PostAction
): PostState => {
  switch (action.type) {
    case 'POST_START':
      return {
        ...state,
        isPosting: true,
        isUploading: false,
        error: null,
        success: false,
      };

    case 'UPLOAD_START':
      return {
        ...state,
        isUploading: true,
        uploadProgress: {
          ...state.uploadProgress,
          [action.payload.fileIndex]: 0,
        },
      };

    case 'UPLOAD_PROGRESS':
      return {
        ...state,
        uploadProgress: {
          ...state.uploadProgress,
          [action.payload.fileIndex]: action.payload.progress,
        },
      };

    case 'POST_SUCCESS':
      return {
        ...state,
        isPosting: false,
        isUploading: false,
        success: true,
        error: null,
        postId: action.payload.postId,
        uploadProgress: {},
      };

    case 'POST_FAILURE':
      return {
        ...state,
        isPosting: false,
        isUploading: false,
        error: action.payload,
        success: false,
        uploadProgress: {},
      };

    case 'POST_RESET':
      return {
        ...initialState,
      };

    case 'POST_RESET_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

