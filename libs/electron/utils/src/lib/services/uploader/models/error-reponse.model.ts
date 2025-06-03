import { Clonable } from "@ever-co/shared-utils";

export class ErrorUpload implements Clonable<{ error: string, itemId: string }> {
  constructor(
    public readonly message: string,
    public readonly itemId: string,
  ) { }

  public clone(): { error: string, itemId: string } {
    return {
      error: this.message,
      itemId: this.itemId,
    };
  }
}