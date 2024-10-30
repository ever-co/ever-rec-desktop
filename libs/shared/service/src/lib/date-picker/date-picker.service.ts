import { Injectable, signal } from '@angular/core';
import { currentDay, IRange } from '@ever-co/shared-utils';

@Injectable({
  providedIn: 'root',
})
export class DatePickerService {
  public range = signal<IRange>({
    start: currentDay().start,
    end: currentDay().end,
  });

  public get start() {
    return this.range().start;
  }

  public get end() {
    return this.range().end;
  }
}
