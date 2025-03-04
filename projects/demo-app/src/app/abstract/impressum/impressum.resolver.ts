import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImpressumResolver {
  private http = inject(HttpClient);

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<string> {
    return this.http.get(`/custom-pages/impressum.html`, { responseType: 'text' }).pipe(
      catchError(() => {
        return of('In der lokalen Demo wird kein Impressum angezeigt.');
      })
    );
  }
}
