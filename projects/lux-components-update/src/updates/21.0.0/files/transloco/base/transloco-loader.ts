import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { forkJoin, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
    const luxc$ = this.http.get<Translation>(`/assets/i18n/luxc-${lang}.json`);
    const app$ = this.http.get<Translation>(`/assets/i18n/${lang}.json`);

    return forkJoin([luxc$, app$]).pipe(map(([luxc, app]) => ({ ...luxc, ...app })));
  }
}
