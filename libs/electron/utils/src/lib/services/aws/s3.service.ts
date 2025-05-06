import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IS3Config, UploadType } from '@ever-co/shared-utils';

export class S3Service {
  private s3!: S3Client;
  constructor(private readonly s3Config: IS3Config) {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.accessKeySecret,
      },
      region: s3Config.region,
      endpoint: s3Config.s3Endpoint,
    });
  }
  public async signedURL(uploadType: UploadType): Promise<string> {
    const params = {
      Bucket: this.s3Config.s3Bucket,
      Key: this.generateS3Key(uploadType),
      Expires: 60,
      ContentType: this.getContentType(uploadType),
    };

    try {
      const signedUrl = await getSignedUrl(
        this.s3,
        new GetObjectCommand(params)
      );
      return signedUrl;
    } catch (error) {
      console.error('Error generating signed URL', error);
      throw new Error('Could not generate signed URL. Please try again later.');
    }
  }

  private generateS3Key(uploadType: UploadType): string {
    const now = new Date();
    return `ever_rec/${uploadType}/${now.getUTCFullYear()}/${
      now.getUTCMonth() + 1
    }/${now.getUTCDate()}`;
  }

  private getContentType(type: UploadType): string {
    switch (type) {
      case UploadType.PHOTO:
      case UploadType.SCREENSHOT:
        return 'image/png';
      case UploadType.VIDEO:
        return 'video/mp4';
      case UploadType.AUDIO:
        return 'audio/webm';
    }
  }
}
