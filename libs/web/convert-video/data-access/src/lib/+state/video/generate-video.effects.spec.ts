import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { GenerateVideoEffects } from './generate-video.effects';

describe('GenerateVideoEffects', () => {
  let actions$: Observable<any>;
  let effects: GenerateVideoEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GenerateVideoEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(GenerateVideoEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
