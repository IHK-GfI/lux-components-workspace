export interface LuxPageEvent {
  pageIndex: number;
  previousPageIndex?: number;
  pageSize: number;
  length: number;
}

export type LuxRangeLabelFn = (page: number, pageSize: number, length: number) => string;
