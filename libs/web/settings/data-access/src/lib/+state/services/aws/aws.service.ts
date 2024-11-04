import { Injectable } from '@angular/core';
import { IS3Config } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import * as AWS from 'aws-sdk';
import { tap } from 'rxjs';
import { selectSettingStorageState } from '../../storage-setting/storage-setting.selectors';

@Injectable({
  providedIn: 'root',
})
export class AwsService {
  private s3!: AWS.S3;
  private config!: IS3Config;
  constructor(private readonly store: Store) {
    this.store
      .select(selectSettingStorageState)
      .pipe(
        tap(({ s3Config }) => {
          this.config = s3Config;
          this.s3 = new AWS.S3({
            accessKeyId: s3Config.accessKeyId,
            secretAccessKey: s3Config.accessKeySecret,
            region: s3Config.region,
            endpoint: s3Config.s3Endpoint,
          });
        })
      )
      .subscribe();
  }
  public async signedURL(fileType: string): Promise<string> {
    const now = new Date();
    const params = {
      Bucket: this.config.s3Bucket,
      Key: `gauzy/videos/${now.getUTCFullYear()}/${now.getUTCMonth()}/${now.getUTCDate()}`,
      Expires: 60,
      ContentType: fileType,
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
