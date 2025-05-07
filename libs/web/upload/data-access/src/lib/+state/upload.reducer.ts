import { createFeature, createReducer, on } from '@ngrx/store';
import { IUploadItem } from '../models/upload.model';
import { uploadActions } from './upload.actions';
import { isEmpty } from '@ever-co/shared-utils';

export const uploadFeatureKey = 'uploadQueue';

export interface UploadState {
  queue: IUploadItem[];
  inProgress: IUploadItem[];
  completed: IUploadItem[];
  failed: IUploadItem[];
  canceled: IUploadItem[];
  activeUploads: number;
  maxParallelUploads: number;
  error: string | null;
}

export const initialState: UploadState = {
  queue: [],
  inProgress: [],
  completed: [],
  failed: [],
  canceled: [],
  activeUploads: 0,
  maxParallelUploads: 3,
  error: null,
};

export const reducer = createReducer(
  initialState,

  on(uploadActions.addItemToQueue, (state, action) => {
    const { item, items } = action;

    if (item && !isEmpty(item)) {
      return {
        ...state,
        queue: [...state.queue, item],
      };
    }

    if (items && !isEmpty(items)) {
      return {
        ...state,
        queue: [...state.queue, ...items],
      };
    }

    return state;
  }),

  on(uploadActions.startItemUpload, (state, { item }) => ({
    ...state,
    queue: state.queue.filter(({ id }) => id !== item.id),
    inProgress: [...state.inProgress, item],
    activeUploads: state.activeUploads + 1,
  })),

  on(uploadActions.uploadItemInProgress, (state, { itemId, progress }) => ({
    ...state,
    inProgress: state.inProgress.map((item) =>
      item.id === itemId ? { ...item, progress } : item
    ),
  })),

  on(uploadActions.uploadItemSuccess, (state, { itemId }) => {
    const item = state.inProgress.find(({ id }) => id === itemId);
    if (!item) {
      return state;
    }
    return {
      ...state,
      inProgress: state.inProgress.filter(({ id }) => id !== itemId),
      completed: [...state.completed, { ...item, progress: 100 }],
      activeUploads: state.activeUploads - 1,
    };
  }),

  on(uploadActions.uploadItemFailure, (state, { itemId, error }) => {
    const item = state.inProgress.find(({ id }) => id === itemId);
    if (!item) {
      return state;
    }
    return {
      ...state,
      inProgress: state.inProgress.filter(({ id }) => id !== itemId),
      failed: [...state.failed, { ...item, error }],
      activeUploads: state.activeUploads - 1,
    };
  }),

  on(uploadActions.cancelUpload, (state, { itemId }) => {
    const canceled =
      state.inProgress.find(({ id }) => id === itemId) ||
      state.queue.find(({ id }) => id === itemId);

    if (!canceled) return state;

    return {
      ...state,
      queue: state.queue.filter(({ id }) => id !== itemId),
      inProgress: state.inProgress.filter(({ id }) => id !== itemId),
      canceled: [...state.canceled, { ...canceled, progress: 0 }],
      activeUploads: state.inProgress.some(({ id }) => id === itemId)
        ? state.activeUploads - 1
        : state.activeUploads,
    };
  }),

  on(uploadActions.removeItemFromQueue, (state, { itemId }) => ({
    ...state,
    queue: state.queue.filter(({ id }) => id !== itemId),
  })),

  on(uploadActions.retryUploadItem, (state, { itemId }) => {
    const failed = state.failed.find(({ id }) => id === itemId);
    if (!failed) return state;
    return {
      ...state,
      failed: state.failed.filter(({ id }) => id !== itemId),
      queue: [...state.queue, { ...failed, progress: 0, error: null }],
    };
  }),

  on(uploadActions.clearUploadOnComplete, (state) => ({
    ...state,
    completed: [],
  }))
);

export const uploadFeature = createFeature({
  name: uploadFeatureKey,
  reducer,
});
