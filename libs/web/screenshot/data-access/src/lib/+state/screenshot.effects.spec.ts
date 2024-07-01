import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ScreenshotEffects } from './screenshot.effects';

describe('ScreenshotEffects', () => {
  let actions$: Observable<any>;
  let effects: ScreenshotEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScreenshotEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(ScreenshotEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
