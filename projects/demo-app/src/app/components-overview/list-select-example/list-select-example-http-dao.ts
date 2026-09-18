import { ILuxListSelectHttpDao, ILuxListSelectHttpDaoConf, ILuxListSelectHttpDaoStructure } from '@ihk-gfi/lux-components';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DemoAdresse } from './list-select-example.component';

/**
 * Simuliert einen serverseitigen Datenzugriff (Muster table-server-example/test-http-dao.ts):
 * Filterung und Seitierung finden hier statt, als würde der Request tatsächlich an einen Server gehen.
 */
export class ListSelectExampleHttpDao implements ILuxListSelectHttpDao<DemoAdresse> {
  constructor(private alleAdressen: DemoAdresse[]) {}

  loadData(conf: ILuxListSelectHttpDaoConf): Observable<ILuxListSelectHttpDaoStructure<DemoAdresse>> {
    let gefiltert = this.alleAdressen;

    if (conf.filter) {
      const term = conf.filter.toLowerCase();
      gefiltert = gefiltert.filter(
        (adresse) => adresse.label.toLowerCase().includes(term) || adresse.subLabel.toLowerCase().includes(term)
      );
    }

    const start = conf.page * conf.pageSize;
    const items = gefiltert.slice(start, start + conf.pageSize);

    return of({ items, totalCount: gefiltert.length }).pipe(delay(1000));
  }
}
