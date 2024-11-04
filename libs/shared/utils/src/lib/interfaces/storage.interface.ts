import { FormControl } from '@angular/forms';

export interface IS3Config {
  accessKeyId: string;
  accessKeySecret: string;
  region: string;
  s3Bucket: string;
  s3Endpoint: string;
}

export interface IS3ConfigForm {
  accessKeyId: FormControl<string | null>;
  accessKeySecret: FormControl<string | null>;
  region: FormControl<string | null>;
  s3Bucket: FormControl<string | null>;
  s3Endpoint: FormControl<string | null>;
}
