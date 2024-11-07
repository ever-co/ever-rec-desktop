import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import { DatePickerService } from '@ever-co/shared-service';
import { Channel } from '@ever-co/shared-utils';

@Injectable({
  providedIn: 'root',
})
export class CopyContextService {
  constructor(
    private readonly electronService: ElectronService,
    private readonly datePickerService: DatePickerService
  ) {}

  public async context(): Promise<string> {
    return this.electronService.invoke(Channel.GET_CONTEXT, {
      range: this.datePickerService.range(),
    });
  }
}
