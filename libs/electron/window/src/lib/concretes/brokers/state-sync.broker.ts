import { AppWindowId, IMessage, IMessageBroker } from '@ever-co/shared-utils';
import { WindowStateMediator } from '../window-state.mediator';

export class StateSyncMessageBroker implements IMessageBroker {
  constructor(
    private readonly message: IMessage,
    private readonly sourceId: AppWindowId,
    private readonly mediator = WindowStateMediator.getInstance()
  ) {}

  public handle(): void {
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
