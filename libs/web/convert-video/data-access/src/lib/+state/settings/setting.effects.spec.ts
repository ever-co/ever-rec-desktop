import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { SettingEffects } from './setting.effects';

describe('SettingEffects', () => {
  let actions$: Observable<any>;
  let effects: SettingEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SettingEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(SettingEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
