import { inject, Injectable } from '@angular/core';
import { generateVideoActions } from '@ever-co/generate-video-data-access';
import { NotificationService } from '@ever-co/notification-data-access';
import { IPaginationOptions, isDeepEqual, IVideo } from '@ever-co/shared-utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
} from 'rxjs/operators';
import { VideoService } from '../services/video.service';
import { videoActions } from './video.actions';

@Injectable()
export class VideoEffects {
  private readonly actions$ = inject(Actions);
  onLoadVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(videoActions.loadVideo),
      mergeMap((options) => {
        return from(this.videoService.getOneVideo(options)).pipe(
          map((video) => videoActions.loadVideoSuccess({ video })),
          catchError((error) => of(videoActions.loadVideoFailure({ error }))),
        );
      }),
    ),
  );

  saveOnFinish$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generateVideoActions.finish),
      map(({ video }) => videoActions.addVideo({ video })),
    ),
  );

  getAllVideos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(videoActions.loadVideos),
      mergeMap((options) =>
        from(
          this.videoService.getAllVideos(options as IPaginationOptions<IVideo>),
        ).pipe(
          map((response) => videoActions.loadVideosSuccess(response)),
          catchError((error) => of(videoActions.loadVideosFailure({ error }))),
        ),
      ),
    ),
  );

  deleteVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(videoActions.deleteVideo),
      mergeMap((video) =>
        from(this.videoService.deleteVideo(video)).pipe(
          map(() => {
            this.notificationService.show('Video deleted', 'success');
            return videoActions.deleteVideoSuccess({ id: video.id });
          }),
          catchError((error) => of(videoActions.deleteVideoFailure({ error }))),
        ),
      ),
    ),
  );

  deleteVideos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(videoActions.deleteVideos),
      mergeMap(({ videos = [] }) =>
        from(this.videoService.deleteVideos(videos)).pipe(
          map(() => {
            this.notificationService.show('Videos deleted', 'success');
            return videoActions.deleteVideosSuccess({ videos });
          }),
          catchError((error) => of(videoActions.deleteVideoFailure({ error }))),
        ),
      ),
    ),
  );

  updateVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(videoActions.updateVideo),
      mergeMap((video) =>
        from(this.videoService.updateVideo(video)).pipe(
          map((response) => videoActions.updateVideoSuccess(response)),
          catchError((error) => of(videoActions.updateVideoFailure({ error }))),
        ),
      ),
    ),
  );

  uploadVideo$ = createEffect(() =>
    this.videoService.onUploadVideo().pipe(
      filter(Boolean),
      distinctUntilChanged(isDeepEqual.bind(this)),
      map((upload) => videoActions.updateUploadedVideo({ upload })),
    ),
  );

  constructor(
    private readonly videoService: VideoService,
    private readonly notificationService: NotificationService,
  ) {}
}
