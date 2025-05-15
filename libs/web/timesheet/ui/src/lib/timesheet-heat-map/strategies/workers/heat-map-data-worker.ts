import { HandlerFactory } from './handlers/handler.factory';
import {
  HeatMapDataMessage,
  HeatMapDataMessageHandler,
  WorkerMessage,
} from './interfaces/data.interface';

export class HeatMapDataWorker {
  private handlerMap: Map<
    string,
    HeatMapDataMessageHandler<HeatMapDataMessage>
  >;

  constructor(handlers = HandlerFactory.createHandlers()) {
    this.handlerMap = new Map();
    handlers.forEach((handler) => {
      this.handlerMap.set(handler.messageType, handler);
    });
  }

  public handleMessage(message: WorkerMessage): void {
    const handler = this.handlerMap.get(message.type);
    if (handler && handler.canHandle(message)) {
      handler.handle(message);
    }
  }
}
