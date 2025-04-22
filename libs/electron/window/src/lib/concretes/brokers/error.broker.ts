import { AppWindowId, IMessage, IMessageBroker } from '@ever-co/shared-utils';
import { WindowStateMediator } from '../window-state.mediator';

export class ErrorMessageBroker implements IMessageBroker {
  constructor(
    private readonly message: IMessage,
    private readonly sourceId: AppWindowId,
    private readonly mediator = WindowStateMediator.getInstance()
  ) {}

  public handle(): void {
    this.mediator.broadcast(this.message, this.sourceId);
  }
}
