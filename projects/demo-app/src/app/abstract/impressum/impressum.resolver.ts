import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';

export const impressumResolver: ResolveFn<string> = (): Observable<string> => {
  const http = inject(HttpClient);

  return http
    .get('/custom-pages/impressum.html', { responseType: 'text' })
    .pipe(catchError(() => of('In der lokalen Demo wird kein Impressum angezeigt.')));
};
