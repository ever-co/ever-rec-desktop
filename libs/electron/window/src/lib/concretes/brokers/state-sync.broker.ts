import {
  AppWindowId,
  isDeepEqual,
  IMessage,
  IMessageBroker,
} from '@ever-co/shared-utils';
import { WindowStateMediator } from '../window-state.mediator';

export class StateSyncMessageBroker implements IMessageBroker {
  private static lastPayload: any = null;

  constructor(
    private readonly message: IMessage,
    private readonly sourceId: AppWindowId,
    private readonly mediator = WindowStateMediator.getInstance()
  ) {}

  public handle(): void {
    const currentPayload = this.message.payload;

    if (isDeepEqual(currentPayload, StateSyncMessageBroker.lastPayload)) {
      return;
    }

    StateSyncMessageBroker.lastPayload = currentPayload;

    this.mediator.broadcast(
      {
        type: this.message.type,
        payload: this.message.payload,
        metadata: { ...this.message.metadata, processed: true },
      },
      this.sourceId
    );
  }
}
