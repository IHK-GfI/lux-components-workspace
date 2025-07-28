import { Injectable } from '@angular/core';
import { LuxAppHeaderAcSessionTimerService } from '@ihk-gfi/lux-components';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class MockAppHeaderAcLuxSessionTimerService extends LuxAppHeaderAcSessionTimerService {
  constructor() {
    super();
    this.startingSeconds.set(1800);
  }

  override extendSessionTimer(): Observable<HttpResponse<any>> {
    this.url = this.configService.currentConfig.sessionTimerConfig?.url ?? '';
    console.log('MockAppHeaderAcLuxSessionTimerService: Session wird verlängert', 'Mit Url', this.url);
    return new Observable((observer) => {
      observer.next(new HttpResponse({ status: 200, body: { message: 'Session extended' } }));
      setTimeout(() => {
        const seconds = this.startingSeconds();
        this.startingSeconds.set(seconds + 1);
        this.startingSeconds.set(seconds);
        observer.complete();
        console.log('MockAppHeaderAcLuxSessionTimerService: Session wurde erfolgreich verlängert');
      }, 5000);
    });
  }

  override logout(): Observable<HttpResponse<any>> {
    this.luxLogoutEvent.emit(true);
    this.logoutUrl = this.configService.currentConfig.sessionTimerConfig?.logoutUrl ?? '';
    console.log('MockAppHeaderAcLuxSessionTimerService: Logout wird aufgerufen', 'Mit Url', this.logoutUrl);
    this.startingSeconds.set(0);
    return new Observable((observer) => {
      observer.next(new HttpResponse({ status: 200, body: { message: 'Logout successful' } }));
      setTimeout(() => {
        observer.complete();
        console.log('MockAppHeaderAcLuxSessionTimerService: Logout wurde erfolgreich durchgeführt');
      }, 0);
    });
  }

  override backToLogin(): void {
    this.loginUrl = this.configService.currentConfig.sessionTimerConfig?.loginUrl ?? '';
    console.log('MockAppHeaderAcLuxSessionTimerService: Zurück zur Login-Seite', 'Mit Url', this.loginUrl);
    this.router.navigate([this.loginUrl]);
  }
}
