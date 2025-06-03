import { Clonable, IUploadError } from "@ever-co/shared-utils";

export class UploadError implements Clonable<IUploadError> {
  constructor(
    public readonly message: string,
    public readonly itemId: string,
  ) { }

  public clone(): IUploadError {
    return {
      error: this.message,
      itemId: this.itemId,
    };
  }
}