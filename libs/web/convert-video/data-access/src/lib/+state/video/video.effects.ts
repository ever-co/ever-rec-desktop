import { Injectable } from '@angular/core';
import { IPaginationOptions } from '@ever-co/shared-utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { VideoElectronService } from '../../services/video-electron.service';
import { generateVideoActions } from '../generate-video/generate-video.actions';
import { videoActions } from './video.actions';

@Injectable()
export class VideoEffects {
  onLoadVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(videoActions.loadVideo),
      mergeMap((options) => {
        return from(this.videoElectronService.getOneVideo(options)).pipe(
          map((video) => videoActions.loadVideoSuccess({ video })),
          catchError((error) => of(videoActions.loadVideoFailure({ error })))
        );
      })
    )
  );

  getAllVideos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        videoActions.loadVideos,
        generateVideoActions.finishSuccess,
        generateVideoActions.loadLastVideoSuccess
      ),
      mergeMap((options) =>
        from(
          this.videoElectronService.getAllVideos(options as IPaginationOptions)
        ).pipe(
          map((response) => videoActions.loadVideosSuccess(response)),
          catchError((error) => of(videoActions.loadVideosFailure({ error })))
        )
      )
    )
  );

  deleteVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(videoActions.deleteVideo),
      mergeMap((video) =>
        from(this.videoElectronService.deleteVideo(video)).pipe(
          map(() => videoActions.deleteVideoSuccess({ id: video.id })),
          catchError((error) => of(videoActions.deleteVideoFailure({ error })))
        )
      )
    )
  );

  updateVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(videoActions.updateVideo),
      mergeMap((video) =>
        from(this.videoElectronService.updateVideo(video)).pipe(
          map((response) => videoActions.updateVideoSuccess(response)),
          catchError((error) => of(videoActions.updateVideoFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private readonly videoElectronService: VideoElectronService
  ) {}
}
