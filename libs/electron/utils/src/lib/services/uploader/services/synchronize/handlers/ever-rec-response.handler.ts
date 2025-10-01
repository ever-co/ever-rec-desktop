import { IUploadBase, IUploadDone } from '@ever-co/shared-utils';
import { IUploaderStrategy } from '../../../models/uploader-strategy.interface';
import { EverRecUploaderStrategy } from '../../../strategies/ever-rec.uploader';
import { ResponseHandler } from './response.handler';

interface IEverRecUploadResult {
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

  protected transform(
    response: IUploadDone<IEverRecUploadResult>,
  ): IUploadBase {
    const { itemId, result } = response;

    if (!result?.data) {
      throw new Error('Invalid EverRec upload response: missing data');
    }

    const { url: remoteUrl, dbData } = result.data;
    const remoteId = dbData?.id;
    const uploadedAt = dbData?.created;

    if (!remoteUrl || !remoteId) {
      throw new Error(
        `Invalid EverRec upload response: missing ${!remoteUrl ? 'url' : 'id'}`,
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
