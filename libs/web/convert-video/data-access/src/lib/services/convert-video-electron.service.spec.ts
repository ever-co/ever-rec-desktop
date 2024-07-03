import { TestBed } from '@angular/core/testing';

import { ConvertVideoElectronService } from './convert-video-electron.service';

describe('ConvertVideoElectronService', () => {
  let service: ConvertVideoElectronService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvertVideoElectronService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
