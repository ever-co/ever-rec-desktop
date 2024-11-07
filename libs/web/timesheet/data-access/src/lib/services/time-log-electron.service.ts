import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import { Channel, IPaginationResponse, ITimeLog, ITimeLogStatistics } from '@ever-co/shared-utils';

@Injectable({
  providedIn: 'root',
})
export class TimeLogElectronService {
  constructor(private readonly electronService: ElectronService) {}

  public getLogs(options = {}): Promise<IPaginationResponse<ITimeLog>> {
    return this.electronService.invoke(Channel.REQUEST_RECENT_LOGS, options);
  }

  public getLog<T>(options: T): Promise<ITimeLog> {
    return this.electronService.invoke(Channel.REQUEST_ONE_LOG, options);
  }

  public deleteLog(timelog: ITimeLog): Promise<void> {
    return this.electronService.invoke(Channel.REQUEST_DELETE_ONE_LOG, timelog);
  }

  public getLogStatistics(options = {}): Promise<ITimeLogStatistics> {
    return this.electronService.invoke(Channel.REQUEST_LOG_STATISTICS, options);
  }

  public getContext(options = {}): Promise<string> {
    return this.electronService.invoke(Channel.GET_CONTEXT, options);
  }
}
