import { Observable } from 'rxjs';

export interface ILuxListSelectHttpDaoConf {
  page: number;
  pageSize: number;
  filter?: string;
}

export interface ILuxListSelectHttpDaoStructure<T = any> {
  items: T[];
  totalCount: number;
}

export interface ILuxListSelectHttpDao<T = any> {
  loadData(conf: ILuxListSelectHttpDaoConf): Observable<ILuxListSelectHttpDaoStructure<T>>;
}
