import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import {
  Channel,
  MediatorIncomingMessage,
  MediatorOutgoingMessage,
} from '@ever-co/shared-utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediatorService {
  constructor(private readonly electronService: ElectronService) {}

  public send(message: MediatorIncomingMessage): void {
    this.electronService.send(Channel.MEDIATOR_INCOMING_MESSAGE, message);
  }

  public receive(): Observable<MediatorOutgoingMessage> {
    return this.electronService.fromEvent(Channel.MEDIATOR_OUTGOING_MESSAGE);
  }
}
