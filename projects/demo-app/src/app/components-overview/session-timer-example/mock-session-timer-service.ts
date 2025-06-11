import { Injectable } from '@angular/core';
import { LuxSessionTimerService } from '@ihk-gfi/lux-components';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class MockLuxSessionTimerService extends LuxSessionTimerService {
  failSessionExtension = false;

  override extendSessionTimer(): Observable<HttpResponse<any>> {
    console.log('MockLuxSessionTimerService: Session wird verlängert', 'Mit Url', this.url);
    return new Observable((observer) => {
      observer.next(new HttpResponse({ status: 200, body: { message: 'Session extended' } }));
      setTimeout(() => {
        if (this.failSessionExtension) {
          observer.error();
          console.log('MockLuxSessionTimerService: Verlängerung der Session ist Fehlgeschlagen');
        } else {
          const seconds = this.startingSeconds();
          this.startingSeconds.set(seconds + 1);
          this.startingSeconds.set(seconds);
          observer.complete();
          console.log('MockLuxSessionTimerService: Session wurde erfolgreich verlängert');
        }
      }, 5000);
    });
  }
}
