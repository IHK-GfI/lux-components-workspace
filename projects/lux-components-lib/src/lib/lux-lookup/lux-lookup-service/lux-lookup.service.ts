import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LuxLookupParameters } from '../lux-lookup-model/lux-lookup-parameters';
import { LuxLookupTableEntry } from '../lux-lookup-model/lux-lookup-table-entry';

@Injectable({
  providedIn: 'root'
})
export class LuxLookupService {
  private http = inject(HttpClient);

  /**
   * Liefert die Eintraege einer Schluesseltabelle.
   * @param tableNo
   * @param parameters
   * @param url
   * @returns Observable<LuxLookupTableEntry[]>
   */
  getLookupTable(tableNo: string, parameters: LuxLookupParameters, url: string): Observable<LuxLookupTableEntry[]> {
    const httpParameters = this.generateParameters(parameters);
    return this.http.get<LuxLookupTableEntry[]>(url + 'getLookupTable/' + tableNo, { params: httpParameters });
  }

  /**
   * Generiert die Standard-Parameter fuer einen Lookup-Request.
   * @param parameters
   * @returns HttpParams
   */
  generateParameters(parameters: LuxLookupParameters): HttpParams {
    let httpParameters = new HttpParams();
    httpParameters = httpParameters.append('knr', '' + parameters.knr);
    httpParameters = httpParameters.append('raw', '' + parameters.raw);

    if (parameters.keys && parameters.keys.length > 0) {
      parameters.keys.forEach((key: string) => {
        httpParameters = httpParameters.append('keys', key);
      });
    }

    if (parameters.fields && parameters.fields.length > 0) {
      // Entferne alle ableitungsText-Felder
      const fields = parameters.fields.filter((field) => !field.startsWith('ableitungsText'));

      if (fields.length > 0) {
        // Fuege alle nicht-ableitungsText-Felder als Http-Parameter hinzu
        fields.forEach((field: string) => {
          httpParameters = httpParameters.append('fields', field);
        });
      }

      // Falls es ableitungsText-Felder gibt, fuege das spezifische Feld 'ableitungsfelder' hinzu.
      // Der Lookup-Service erwartet dieses spezielle Feld, um alle Ableitungsfelder zu liefern.
      // Aktuell ist es unmöglich, einzelne ableitungsText-Felder anzufordern.
      if (parameters.fields.length !== fields.length) {
        httpParameters = httpParameters.append('fields', 'ableitungsfelder');
      }
    }

    return httpParameters;
  }
}
