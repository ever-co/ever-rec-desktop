export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  filter?: string;
}

export interface IPaginationResponse<T> {
  data: T[];
  count: number;
  hasNext: boolean;
}
