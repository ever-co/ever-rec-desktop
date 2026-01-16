import { IUploaderStrategy } from '../../../models/uploader-strategy.interface';

export abstract class ResponseHandler<TRequest, TResponse> {
  protected nextHandler: ResponseHandler<TRequest, TResponse> | null = null;

  setNext(
    handler: ResponseHandler<TRequest, TResponse>,
  ): ResponseHandler<TRequest, TResponse> {
    this.nextHandler = handler;
    return handler;
  }

  // Template method with chain logic
  public handle(strategy: IUploaderStrategy, response: TRequest): TResponse {
    if (this.canHandle(strategy)) {
      return this.transform(response);
    }

    if (this.nextHandler) {
      return this.nextHandler.handle(strategy, response);
    }

    throw new Error('No handler available to process the request');
  }

  protected abstract canHandle(strategy: IUploaderStrategy): boolean;
  protected abstract transform(response: TRequest): TResponse;
}
