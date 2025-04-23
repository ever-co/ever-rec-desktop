import {
  AppWindowId,
  IMessage,
  IMessageBroker,
  IMessageBrokerFactory,
} from '@ever-co/shared-utils';

export abstract class MessageBrokerFactory implements IMessageBrokerFactory {
  private _next?: IMessageBrokerFactory;

  public setNext(factory: IMessageBrokerFactory): IMessageBrokerFactory {
    this._next = factory;
    return factory;
  }

  protected getNext(): IMessageBrokerFactory | undefined {
    return this._next;
  }

  public abstract canHandle(message: IMessage): boolean;
  public abstract createMessageBroker(
    message: IMessage,
    sourceId: AppWindowId
  ): IMessageBroker | undefined;
}
