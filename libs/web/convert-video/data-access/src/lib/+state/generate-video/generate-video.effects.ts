import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { screenshotActions } from '@ever-co/screenshot-data-access';
import { LocalStorageService } from '@ever-co/shared-service';
import { IVideo } from '@ever-co/shared-utils';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { ConvertVideoElectronService } from '../../services/convert-video-electron.service';
import { selectSettingState } from '../settings/setting.selectors';
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
        return new Promise<Action<string>>((resolve) => {
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
        return new Promise<Action<string>>((resolve) => {
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
        return new Promise<Action<string>>((resolve) => {
          this.convertVideoElectronService.onError((error) => {
            resolve(generateVideoActions.triggerError({ error }));
          });
        });
      }),
      catchError((error) => of(generateVideoActions.failure({ error })))
    )
  );

  onAutoGenerate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(screenshotActions.startCapture),
      switchMap(() =>
        this.store.select(selectSettingState).pipe(
          mergeMap(({ videoConfig }) => {
            return new Promise<Action<string>>((resolve) => {
              this.convertVideoElectronService.autoGenerate(videoConfig);
              this.convertVideoElectronService.onAutoGenerate(() => {
                resolve(generateVideoActions.start({ config: videoConfig }));
              });
            });
          })
        )
      ),
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
    private readonly storageService: LocalStorageService,
    private readonly store: Store
  ) {}
}
