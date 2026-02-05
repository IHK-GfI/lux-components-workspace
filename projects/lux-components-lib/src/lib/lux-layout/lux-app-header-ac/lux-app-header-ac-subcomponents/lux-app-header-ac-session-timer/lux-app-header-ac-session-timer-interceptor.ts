import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LuxUtil } from '../../../../lux-util/lux-util';
import { LuxAppHeaderAcSessionTimerService } from './lux-app-header-ac-session-timer-service/lux-app-header-ac-session-timer.service';
import { LuxComponentsConfigService } from '../../../../lux-components-config/lux-components-config.service';

@Injectable({
  providedIn: 'root'
})
export class LuxAppHeaderAcSessionTimerInterceptor implements HttpInterceptor {
  luxSessionTimerService = inject(LuxAppHeaderAcSessionTimerService);
  configService = inject(LuxComponentsConfigService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (!LuxUtil.checkIfRequestIsAssetRequest(req) && event instanceof HttpResponse) {
          const headers = event.headers;

          const prolongation = headers.get(
            this.configService.currentConfig.sessionTimerConfig?.httpSessionProlongationHeaderName || 'X-GfI-Session-Prolongation'
          );
          this.luxSessionTimerService.canExtendSession = prolongation?.toLowerCase() === 'true';

          const sessionTimeHeader = headers.get(
            this.configService.currentConfig.sessionTimerConfig?.httpSessionTimeHeaderName || 'X-GfI-Session-Time'
          );
          const sessionTime = Number(sessionTimeHeader);
          if (!Number.isNaN(sessionTime)) {
            this.luxSessionTimerService.resetTimer(sessionTime);
          }
        }
      })
    );
  }
}
