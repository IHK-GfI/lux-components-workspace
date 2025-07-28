import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LuxUtil } from '../../../../lux-util/lux-util';
import { LuxAppHeaderAcSessionTimerService } from './lux-app-header-ac-session-timer-service/lux-app-header-ac-session-timer.service';

@Injectable({
  providedIn: 'root'
})
export class LuxAppHeaderAcSessionTimerInterceptor implements HttpInterceptor {
  luxSessionTimerService = inject(LuxAppHeaderAcSessionTimerService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap({
        next: () => {
          if (!LuxUtil.checkIfRequestIsAssetRequest(req) && req.headers.has('X-Session-Time')) {
            if (req.headers.has('X-GfI-Session-Prolongation')) {
              this.luxSessionTimerService.canExtendSession = Boolean(req.headers.get('X-GfI-Session-Prolongation'));
            }

            const sessionTime = Number(req.headers.get('X-Session-Time'));
            // Workaround: wenn der Wert von dem Signal sich nicht ändert wird die Change Detection nicht getriggert
            this.luxSessionTimerService.startingSeconds.set(sessionTime + 1);
            this.luxSessionTimerService.startingSeconds.set(sessionTime);
          }
        }
      })
    );
  }
}
