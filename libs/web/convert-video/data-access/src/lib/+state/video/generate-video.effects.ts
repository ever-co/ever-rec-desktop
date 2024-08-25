import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { LocalstorageService } from '@ever-capture/shared-service';
import { IVideo } from '@ever-capture/shared-utils';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ConvertVideoElectronService } from '../../services/convert-video-electron.service';
import { generateVideoActions } from './generate-video.actions';

@Injectable()
export class GenerateVideoEffects {
  private readonly KEY = '_lastGeneratedVideo';
  startGenerateVideos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(generateVideoActions.start),
      map((action) => {
        this.convertVideoElectronService.startGenerate(action);
        return generateVideoActions.startSuccess();
      }),
      catchError((error) => of(generateVideoActions.failure({ error })))
    );
  });

  cancelGenerateVideos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        generateVideoActions.cancel,
        generateVideoActions.finish,
        generateVideoActions.triggerError
      ),
      map(() => {
        this.convertVideoElectronService.cancelGenerate();
        return generateVideoActions.cancelSuccess();
      }),
      catchError((error) => of(generateVideoActions.failure({ error })))
    );
  });

  onProgress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generateVideoActions.progress, generateVideoActions.startSuccess),
      mergeMap(() => {
        return new Promise((resolve) => {
          this.convertVideoElectronService.onProgress((progress) => {
            resolve(generateVideoActions.progress({ progress }));
          });
        });
      }),
      catchError((error) => of(generateVideoActions.failure({ error })))
    )
  );

  onDone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generateVideoActions.startSuccess),
      mergeMap(() => {
        return new Promise((resolve) => {
          this.convertVideoElectronService.onDone((video) => {
            resolve(generateVideoActions.finish({ video }));
          });
        });
      }),
      catchError((error) => of(generateVideoActions.failure({ error })))
    )
  );

  onError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generateVideoActions.startSuccess),
      mergeMap(() => {
        return new Promise((resolve) => {
          this.convertVideoElectronService.onError((error) => {
            resolve(generateVideoActions.triggerError({ error }));
          });
        });
      }),
      catchError((error) => of(generateVideoActions.failure({ error })))
    )
  );

  onFinish$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generateVideoActions.finish),
      mergeMap(({ video }) => {
        return this.storageService.setItem<IVideo>(this.KEY, video).pipe(
          map(() => generateVideoActions.finishSuccess()),
          catchError((error) => of(generateVideoActions.failure({ error })))
        );
      })
    )
  );

  onLoadLastVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generateVideoActions.loadLastVideo),
      mergeMap(() => {
        return this.storageService.getItem<IVideo>(this.KEY).pipe(
          map((video) => generateVideoActions.loadLastVideoSuccess({ video })),
          catchError((error) => of(generateVideoActions.failure({ error })))
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private readonly convertVideoElectronService: ConvertVideoElectronService,
    private readonly storageService: LocalstorageService
  ) {}
}
