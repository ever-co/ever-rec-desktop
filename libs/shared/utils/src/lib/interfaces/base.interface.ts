import { IpcMainEvent } from 'electron';
import { FindOneOptions, FindOptionsWhere } from 'typeorm';

export interface IBase {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export type IFindOneOptions = FindOneOptions;

export type IFindOptionsWhere<T> = FindOptionsWhere<T>;

export interface ISelected<T> {
  data: T;
  selected: boolean;
}

export interface IConversionStrategy {
  execute(event: IpcMainEvent): Promise<void>;
}
