import { IUploaderStrategy } from './models/uploader-strategy.interface';

export class ContextUploader {
  private _strategy: IUploaderStrategy;

  constructor(readonly uploaderStrategy: IUploaderStrategy) {
    this._strategy = uploaderStrategy;
  }

  public get strategy(): IUploaderStrategy {
    return this._strategy;
  }

  public set strategy(value: IUploaderStrategy) {
    this._strategy = value;
  }
}
