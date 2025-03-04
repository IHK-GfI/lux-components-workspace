import { Injectable } from '@angular/core';
import { LuxLookupParameters, LuxLookupService, LuxLookupTableEntry } from 'lux-components-lib';
import { of } from 'rxjs';
import { mockResult } from './mock-result';

@Injectable()
export class MockLuxLookupService extends LuxLookupService {
  override getLookupTable(_tableNo: string, parameters: LuxLookupParameters) {
    return of(this.filterKeys([...mockResult], parameters));
  }

  /**
   * Filtert das Mock Ergebnis anhand evtl. übergebener Key-Werte.
   * @param array
   * @param parameters
   */
  private filterKeys(array: LuxLookupTableEntry[], parameters: LuxLookupParameters) {
    if (!parameters.keys || parameters.keys.length === 0) {
      return array;
    }
    return array.filter((entry) => parameters.keys.indexOf(entry.key) > -1);
  }
}
