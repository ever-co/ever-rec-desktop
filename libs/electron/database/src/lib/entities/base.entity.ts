import { IBase } from '@ever-capture/shared-utils';

export abstract class Base implements IBase {
  public id: string;
  public createdAt?: string;
  public updatedAt?: string;
  public deletedAt?: string | null;

  constructor(partial: Partial<Base> = {}) {
    Object.assign(this, partial);
  }
}
