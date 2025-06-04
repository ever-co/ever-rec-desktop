import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUpload from './upload.reducer';

export const selectUploadState = createFeatureSelector<fromUpload.UploadState>(
  fromUpload.uploadFeatureKey
);

export const selectUploadQueue = createSelector(
  selectUploadState,
  (state) => state.queue
);

export const selectInProgress = createSelector(
  selectUploadState,
  (state) => state.inProgress
);

export const selectCompleted = createSelector(
  selectUploadState,
  (state) => state.completed
);

export const selectFailed = createSelector(
  selectUploadState,
  (state) => state.failed
);

export const selectCanceled = createSelector(
  selectUploadState,
  (state) => state.canceled
);

export const selectActiveUploads = createSelector(
  selectUploadState,
  (state) => state.activeUploads
);

export const selectUploadInProgress = createSelector(
  selectUploadState,
  (state) => state.activeUploads > 0 && state.inProgress.length > 0
);

export const selectMaxParallelUploads = createSelector(
  selectUploadState,
  (state) => state.maxParallelUploads
);

export const selectCanUploadMore = createSelector(
  selectActiveUploads,
  selectMaxParallelUploads,
  (active, max) => active < max
);

export const selectHasInProgressUploads = createSelector(
  selectUploadState,
  (state) => state.inProgress.length > 0
);

export const selectHasQueuedUploads = createSelector(
  selectUploadState,
  (state) => state.queue.length > 0
);

export const selectHasCanceledUploads = createSelector(
  selectUploadState,
  (state) => state.canceled.length > 0
);
