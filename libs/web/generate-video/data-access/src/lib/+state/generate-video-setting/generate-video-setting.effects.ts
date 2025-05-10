import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '@ever-co/shared-service';
import { IVideoConfig } from '@ever-co/shared-utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { generateVideoSettingActions } from './generate-video-setting.actions';

@Injectable()
export class GenerateVideoSettingEffects {
  private key = '_video_config';
  private readonly actions$ = inject(Actions);

  loadSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(generateVideoSettingActions.load),
      concatMap(() =>
        this.localStorageService.getItem<IVideoConfig>(this.key).pipe(
          map((videoConfig) =>
            generateVideoSettingActions.loadSuccess({ videoConfig }),
          ),
          catchError((error) =>
            of(generateVideoSettingActions.failure({ error })),
          ),
        ),
      ),
    );
  });

  updateSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(generateVideoSettingActions.update),
      concatMap(({ videoConfig }) =>
        this.localStorageService
          .setItem<IVideoConfig>(this.key, videoConfig, { merge: true })
          .pipe(
            map(() => generateVideoSettingActions.load()),
            catchError((error) =>
              of(generateVideoSettingActions.failure({ error })),
            ),
          ),
      ),
    );
  });

  constructor(private readonly localStorageService: LocalStorageService) {}
}
