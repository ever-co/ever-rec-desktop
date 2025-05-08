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

    // Create a Set of existing IDs for O(1) lookup
    const existingIds = new Set(state.queue.map((queueItem) => queueItem.id));

    // Handle single item addition
    if (item && !isEmpty(item)) {
      // Only add if item doesn't already exist
      if (!existingIds.has(item.id)) {
        return {
          ...state,
          queue: [...state.queue, item],
        };
      }
      return state;
    }

    // Handle multiple items addition
    if (items && !isEmpty(items)) {
      // Filter out items that already exist in the queue using the Set
      const uniqueItems = items.filter(
        (newItem) => !existingIds.has(newItem.id)
      );

      // Only update state if there are new unique items
      if (uniqueItems.length > 0) {
        return {
          ...state,
          queue: [...state.queue, ...uniqueItems],
        };
      }
    }

    return state;
  }),

  on(uploadActions.startItemUpload, (state, { item }) => {
    // Validate that we have a valid item with an id
    if (!item || !item.id) return state;

    // Check if item exists in queue
    const queueIndex = state.queue.findIndex(({ id }) => id === item.id);

    // If item not found in queue, return unchanged state
    if (queueIndex === -1) return state;

    // Check if item already exists in inProgress to prevent duplicates
    const existsInProgress = state.inProgress.some(({ id }) => id === item.id);
    if (existsInProgress) {
      // If it's already in progress, just remove it from queue
      return {
        ...state,
        queue: [
          ...state.queue.slice(0, queueIndex),
          ...state.queue.slice(queueIndex + 1),
        ],
      };
    }

    // Create new queue array by removing the item
    const newQueue = [
      ...state.queue.slice(0, queueIndex),
      ...state.queue.slice(queueIndex + 1),
    ];

    // Initialize progress to 0 if not already set
    const itemWithProgress = {
      ...item,
      progress: item.progress ?? 0,
    };

    return {
      ...state,
      queue: newQueue,
      inProgress: [...state.inProgress, itemWithProgress],
      activeUploads: state.activeUploads + 1,
    };
  }),

  on(uploadActions.uploadItemInProgress, (state, { itemId, progress }) => {
    // Early return if no in-progress uploads
    if (!state.inProgress.length) return state;

    // Find the item index in inProgress array
    const itemIndex = state.inProgress.findIndex(({ id }) => id === itemId);

    // If item not found, return unchanged state
    if (itemIndex === -1) return state;

    // Validate progress value to ensure it's within 0-100 range
    const validProgress = Math.min(100, Math.max(0, progress));

    // Check if the progress is actually different from current value
    const currentItem = state.inProgress[itemIndex];
    if (currentItem.progress === validProgress) return state;

    // Create new inProgress array with updated item
    const newInProgress = [...state.inProgress];
    newInProgress[itemIndex] = { ...currentItem, progress: validProgress };

    return {
      ...state,
      inProgress: newInProgress,
    };
  }),

  on(uploadActions.uploadItemSuccess, (state, { itemId }) => {
    // Early return if no in-progress uploads
    if (!state.inProgress.length) return state;

    // Find the item index in inProgress array
    const itemIndex = state.inProgress.findIndex(({ id }) => id === itemId);

    // If item not found, return unchanged state
    if (itemIndex === -1) return state;

    // Get the successful item
    const item = state.inProgress[itemIndex];

    // Check if item already exists in completed array to prevent duplicates
    const existsInCompleted = state.completed.some(({ id }) => id === itemId);

    // Create new inProgress array by removing the completed item
    const newInProgress = [
      ...state.inProgress.slice(0, itemIndex),
      ...state.inProgress.slice(itemIndex + 1),
    ];

    // Create the completed item with 100% progress
    const completedItem = { ...item, progress: 100 };

    return {
      ...state,
      inProgress: newInProgress,
      // Only add to completed if not already there
      completed: existsInCompleted
        ? state.completed
        : [...state.completed, completedItem],
      activeUploads: Math.max(0, state.activeUploads - 1), // Prevent negative counts
    };
  }),

  on(uploadActions.uploadItemFailure, (state, { itemId, error }) => {
    // Early return if no in-progress uploads
    if (!state.inProgress.length) return state;

    // Find the item index in inProgress array
    const itemIndex = state.inProgress.findIndex(({ id }) => id === itemId);

    // If item not found, return unchanged state
    if (itemIndex === -1) return state;

    // Get the failing item
    const item = state.inProgress[itemIndex];

    // Check if item already exists in failed array to prevent duplicates
    const existsInFailed = state.failed.some(({ id }) => id === itemId);

    // Create new inProgress array by removing the failed item
    const newInProgress = [
      ...state.inProgress.slice(0, itemIndex),
      ...state.inProgress.slice(itemIndex + 1),
    ];

    // Create the failed item with error
    const failedItem = { ...item, error };

    return {
      ...state,
      inProgress: newInProgress,
      // Only add to failed if not already there
      failed: existsInFailed ? state.failed : [...state.failed, failedItem],
      activeUploads: Math.max(0, state.activeUploads - 1), // Prevent negative counts
    };
  }),

  on(uploadActions.cancelUpload, (state, { itemId }) => {
    // Check if item exists in inProgress array
    const inProgressIndex = state.inProgress.findIndex(
      ({ id }) => id === itemId
    );
    const isInProgress = inProgressIndex !== -1;

    // Check if item exists in queue array
    const queueIndex = !isInProgress
      ? state.queue.findIndex(({ id }) => id === itemId)
      : -1;
    const isInQueue = queueIndex !== -1;

    // If item not found in either array, return unchanged state
    if (!isInProgress && !isInQueue) return state;

    // Determine which array contains the item to be canceled
    const canceled = isInProgress
      ? state.inProgress[inProgressIndex]
      : state.queue[queueIndex];

    // Check if the item already exists in the canceled array to prevent duplicates
    const alreadyCanceled = state.canceled.some(({ id }) => id === itemId);

    // Construct the new state
    return {
      ...state,
      // Remove from queue if present
      queue: isInQueue
        ? [
            ...state.queue.slice(0, queueIndex),
            ...state.queue.slice(queueIndex + 1),
          ]
        : state.queue,

      // Remove from inProgress if present
      inProgress: isInProgress
        ? [
            ...state.inProgress.slice(0, inProgressIndex),
            ...state.inProgress.slice(inProgressIndex + 1),
          ]
        : state.inProgress,

      // Add to canceled list (if not already there)
      canceled: alreadyCanceled
        ? state.canceled
        : [...state.canceled, { ...canceled, progress: 0 }],

      // Decrement activeUploads only if item was in inProgress
      activeUploads: isInProgress
        ? state.activeUploads - 1
        : state.activeUploads,
    };
  }),

  on(uploadActions.removeItemFromQueue, (state, { itemId }) => ({
    ...state,
    queue: state.queue.filter(({ id }) => id !== itemId),
  })),

  on(uploadActions.retryUploadItem, (state, { itemId }) => {
    // Early return if no failed items
    if (!state.failed.length) return state;

    // Find the failed item index (more efficient for subsequent operations)
    const failedIndex = state.failed.findIndex(({ id }) => id === itemId);

    // If item not found in failed items, return unchanged state
    if (failedIndex === -1) return state;

    // Get the failed item without mutating it
    const failed = state.failed[failedIndex];

    // Check if item already exists in queue to prevent duplicates
    const existsInQueue = state.queue.some(({ id }) => id === itemId);

    // Create a new failed array by removing the item at failedIndex
    const newFailed = [
      ...state.failed.slice(0, failedIndex),
      ...state.failed.slice(failedIndex + 1),
    ];

    // Prepare the item for retry with reset progress and cleared error
    const retryItem = { ...failed, progress: 0, error: null };

    return {
      ...state,
      failed: newFailed,
      // Only add to queue if it doesn't exist already
      queue: existsInQueue ? state.queue : [...state.queue, retryItem],
    };
  }),

  on(uploadActions.clearUploadOnComplete, (state) => ({
    ...state,
    completed: [],
  })),

  on(uploadActions.retryAllFailedUploads, (state) => {
    // Early return if no failed items to avoid unnecessary state update
    if (!state.failed.length) return state;

    // Reset progress and clear errors for all failed items
    const itemsToRetry = state.failed.map((item) => ({
      ...item,
      progress: 0,
      error: null,
    }));

    // Create a Set of existing IDs in queue for O(1) lookup
    const existingIds = new Set(state.queue.map((item) => item.id));

    // Filter out any failed items that already exist in the queue
    const uniqueItemsToRetry = itemsToRetry.filter(
      (item) => !existingIds.has(item.id)
    );

    // Only add unique items to avoid duplicates
    return {
      ...state,
      queue: [...state.queue, ...uniqueItemsToRetry],
      failed: [],
    };
  }),

  on(uploadActions.clearFailedUploads, (state) => ({
    ...state,
    failed: [],
  })),

  on(uploadActions.clearUploadQueue, (state) => ({
    ...state,
    queue: [],
  })),

  on(uploadActions.clearCanceledUploads, (state) => ({
    ...state,
    canceled: [],
  }))
);

export const uploadFeature = createFeature({
  name: uploadFeatureKey,
  reducer,
});
