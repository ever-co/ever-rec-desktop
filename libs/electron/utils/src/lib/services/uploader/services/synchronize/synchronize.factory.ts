import { IUploadBase, IUploadDone } from '@ever-co/shared-utils';
import { IUploaderStrategy } from '../../models/uploader-strategy.interface';
import { DefaultResponseHandler } from './handlers/default-response.handler';
import { EverRecResponseHandler } from './handlers/ever-rec-response.handler';
import { ResponseHandler } from './handlers/response.handler';

export class SynchronizeFactory {
  private readonly chain: ResponseHandler<IUploadDone, IUploadBase>;

  constructor() {
    this.chain = new EverRecResponseHandler();
    this.chain.setNext(new DefaultResponseHandler());
  }

  public synchronize(
    strategy: IUploaderStrategy,
    response: IUploadDone,
  ): IUploadBase {
    return this.chain.handle(strategy, response);
  }
}
