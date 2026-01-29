export interface PagingResponse<T> {
  records: T[];
  total: number;
  pageSize: number;
  current: number;
  pages: number;
}

export enum NumberBoolean {
  FALSE = 0,
  TRUE = 1,
}
