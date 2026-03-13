import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { LuxUtil } from '../../../../lux-util/lux-util';
import { LuxAppHeaderAcSessionTimerService } from './lux-app-header-ac-session-timer-service/lux-app-header-ac-session-timer.service';
import { LuxComponentsConfigService } from '../../../../lux-components-config/lux-components-config.service';

export const luxSessionTimerInterceptor: HttpInterceptorFn = (req, next) => {
  const timerService = inject(LuxAppHeaderAcSessionTimerService);
  const configService = inject(LuxComponentsConfigService);

  return next(req).pipe(
    tap((event) => {
      if (!LuxUtil.checkIfRequestIsAssetRequest(req) && event instanceof HttpResponse) {
        const headers = event.headers;
        const prolongation = headers.get(
          configService.currentConfig.sessionTimerConfig?.httpSessionProlongationHeaderName || 'X-GfI-Session-Prolongation'
        );
        timerService.canExtendSession = prolongation?.toLowerCase() === 'true';

        const sessionTimeHeader = headers.get(
          configService.currentConfig.sessionTimerConfig?.httpSessionTimeHeaderName || 'X-GfI-Session-Time'
        );
        const sessionTime = Number(sessionTimeHeader);
        if (sessionTimeHeader !== null && !Number.isNaN(sessionTime) && sessionTime > 0) {
          timerService.resetTimer(sessionTime);
        }
      }
    })
  );
};
