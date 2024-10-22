import { TestBed } from '@angular/core/testing';

import { StorageElectronService } from './storage-electron.service';

describe('StorageElectronService', () => {
  let service: StorageElectronService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageElectronService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
