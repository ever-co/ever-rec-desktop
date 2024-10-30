import { TestBed } from '@angular/core/testing';

import { DatePickerService } from './date-picker.service';

describe('DatePickerService', () => {
  let service: DatePickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatePickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
