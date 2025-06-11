import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { LuxUtil } from '../lux-util/lux-util';
import { LuxSessionTimerService } from './lux-session-timer-service/lux-session-timer.service';

@Injectable({
  providedIn: 'root'
})
export class LuxSessionTimerInterceptor implements HttpInterceptor {
  luxSessonTimerService = inject(LuxSessionTimerService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap({
        next: () => {
          if (!LuxUtil.checkIfRequestIsAssetRequest(req) && req.headers.has('X-Session-Time')) {
            const sessionTime = Number(req.headers.get('X-Session-Time'));
            // Workaround: wenn der Wert von dem Signal sich nicht ändert wird die Change Detection nicht getriggert
            this.luxSessonTimerService.startingSeconds.set(sessionTime + 1);
            this.luxSessonTimerService.startingSeconds.set(sessionTime);
          }
        }
      })
    );
  }
}
