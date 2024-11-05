import { IS3Config, UploadType } from '@ever-co/shared-utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import S3 from 'aws-sdk/clients/s3';

export class S3Service {
  private s3!: S3;
  constructor(private readonly s3Config: IS3Config) {
    this.s3 = new S3({
      accessKeyId: s3Config.accessKeyId,
      secretAccessKey: s3Config.accessKeySecret,
      region: s3Config.region,
      endpoint: s3Config.s3Endpoint,
      signatureVersion: 'v4',
    });
  }
  public async signedURL(uploadType: UploadType): Promise<string> {
    const now = new Date();
    const params = {
      Bucket: this.s3Config.s3Bucket,
      Key: `gauzy/videos/${now.getUTCFullYear()}/${now.getUTCMonth()}/${now.getUTCDate()}`,
      Expires: 60,
      ContentType:
        uploadType === UploadType.SCREENSHOT ? 'image/png' : 'video/mp4',
    };

    try {
      const signedUrl = await this.s3.getSignedUrlPromise('putObject', params);
      return signedUrl;
    } catch (error) {
      console.error('Error generating signed URL', error);
      throw new Error('Could not generate signed URL. Please try again later.');
    }
  }
}
