import { IUploadBase, IUploadDone } from '@ever-co/shared-utils';
import { IUploaderStrategy } from '../../../models/uploader-strategy.interface';
import { ResponseHandler } from './response.handler';

export class DefaultResponseHandler extends ResponseHandler<
  IUploadDone,
  IUploadBase
> {
  protected canHandle(_: IUploaderStrategy): boolean {
    return true; // Handles all remaining cases
  }

  protected transform(response: IUploadDone): IUploadBase {
    const { itemId, result } = response;

    return {
      id: itemId,
      remoteUrl: result.fullUrl,
      remoteId: result.id,
      uploadedAt: result.recordedAt,
    };
  }
}
