import { FindOneOptions } from 'typeorm';

export interface IBase {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export type IFindOneOptions = FindOneOptions;
