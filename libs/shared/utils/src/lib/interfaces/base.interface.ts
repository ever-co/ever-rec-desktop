import { IpcMainEvent } from 'electron';
import { FindOneOptions, FindOptionsWhere, FindManyOptions } from 'typeorm';

export interface IBase {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export type IFindOneOptions<T> = FindOneOptions<T>;

export type IFindManyOptions<T> = FindManyOptions<T>;

export type IFindOptionsWhere<T> = FindOptionsWhere<T>;

export interface ISelected<T> {
  data: T;
  selected: boolean;
}

export interface IConversionStrategy {
  execute(event: IpcMainEvent): Promise<void>;
}
