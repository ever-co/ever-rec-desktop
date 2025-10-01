import { IRemoteUpload, IUploadBase, IUploadDone } from '@ever-co/shared-utils';
import { IUploaderStrategy } from '../../../models/uploader-strategy.interface';
import { EverRecUploaderStrategy } from '../../../strategies/ever-rec.uploader';
import { ResponseHandler } from './response.handler';

interface IEverRecUploadResult extends IRemoteUpload {
  url: string;
  dbData: {
    id: string;
    created: string;
  };
}

export class EverRecResponseHandler extends ResponseHandler<
  IUploadDone,
  IUploadBase
> {
  protected canHandle(strategy: IUploaderStrategy): boolean {
    return strategy instanceof EverRecUploaderStrategy;
  }

  protected transform(response: IUploadDone): IUploadBase {
    const { itemId, result } = response;
    const {
      url: remoteUrl,
      dbData: { id: remoteId, created: uploadedAt },
    } = result as IEverRecUploadResult;

    if (!remoteUrl || !remoteId) {
      throw new Error(
        'Invalid EverRec upload response: missing required fields',
      );
    }

    return {
      id: itemId,
      remoteUrl,
      remoteId,
      uploadedAt,
    };
  }
}
