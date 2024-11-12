import { Injectable } from '@angular/core';
import { generateVideoActions } from '@ever-co/convert-video-data-access';
import { ScreenshotElectronService } from '@ever-co/screenshot-data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { timelineActions } from './timeline.actions';

@Injectable()
export class TimelineEffects {
  loadFrames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(timelineActions.loadFrames),
      switchMap((action) =>
        from(
          this.frameService.getAllScreenshots({
            sortField: 'createdAt',
            sortOrder: 'ASC',
            ...action,
          })
        ).pipe(
          map((frames) => timelineActions.loadFramesSuccess(frames)),
          catchError((error) =>
            of(
              timelineActions.loadFramesFailure({
                error,
              })
            )
          )
        )
      )
    )
  );

  updateCurrentTime$ = createEffect(() =>
    this.actions$.pipe(
      ofType(timelineActions.updateCurrentTime),
      map(({ currentTime }) => timelineActions.seekTo({ currentTime }))
    )
  );

  saveLastVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generateVideoActions.loadLastVideoSuccess),
      map(({ video }) => timelineActions.loadLastVideo({ video }))
    )
  );

  reset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(timelineActions.resetTimeline),
      map(() => generateVideoActions.reset())
    )
  );

  constructor(
    private actions$: Actions,
    private readonly frameService: ScreenshotElectronService
  ) {}
}
