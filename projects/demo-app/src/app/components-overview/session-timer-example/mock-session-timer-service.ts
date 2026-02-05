import { Injectable } from '@angular/core';
import { LuxAppHeaderAcSessionTimerService } from '@ihk-gfi/lux-components';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class MockAppHeaderAcLuxSessionTimerService extends LuxAppHeaderAcSessionTimerService {
  constructor() {
    super();
    this.resetTimer(1800);
  }

  override extendSessionTimer(): Observable<HttpResponse<any>> {
    this.url = this.configService.currentConfig.sessionTimerConfig?.url ?? '';
    console.log('MockAppHeaderAcLuxSessionTimerService: Session wird verlängert', 'Mit Url', this.url);
    return new Observable((observer) => {
      observer.next(new HttpResponse({ status: 200, body: { message: 'Session extended' } }));
      setTimeout(() => {
        this.resetTimer(this.startingSeconds());
        observer.complete();
        console.log('MockAppHeaderAcLuxSessionTimerService: Session wurde erfolgreich verlängert');
      }, 5000);
    });
  }
}
