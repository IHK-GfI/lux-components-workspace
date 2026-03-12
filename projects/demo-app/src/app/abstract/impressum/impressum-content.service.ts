import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, firstValueFrom, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImpressumContentService {
  private http = inject(HttpClient);

  public content = '';
  private loading?: Promise<string>;
  private loaded = false;

  async load(): Promise<string> {
    if (this.loaded) {
      return this.content;
    }

    if (!this.loading) {
      this.loading = firstValueFrom(
        this.http.get('/custom-pages/impressum.html', { responseType: 'text' }).pipe(
          catchError(() => {
            return of('In der lokalen Demo wird kein Impressum angezeigt.');
          })
        )
      ).then((text) => {
        this.content = text;
        this.loaded = true;
        return text;
      });
    }

    return this.loading;
  }
}
