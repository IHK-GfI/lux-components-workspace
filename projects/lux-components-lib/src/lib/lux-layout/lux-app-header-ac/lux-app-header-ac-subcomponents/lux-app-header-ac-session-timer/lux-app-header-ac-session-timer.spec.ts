import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideLuxTranslocoTesting } from '../../../../../testing/transloco-test.provider';
import { LuxAppHeaderAcSessionTimerComponent } from './lux-app-header-ac-session-timer';
import {
  LuxAppHeaderAcSessionTimerService,
  LuxSessionTimerBroadcastType
} from './lux-app-header-ac-session-timer-service/lux-app-header-ac-session-timer.service';

describe('LuxAppHeaderAcSessionTimerComponent', () => {
  const sessionTimerStorageKey = 'lux-components-session-endtime';
  let component: MockSessionTimerComponent;
  let fixture: ComponentFixture<MockSessionTimerComponent>;
  let timerService: LuxAppHeaderAcSessionTimerService;
  let httpController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    localStorage.removeItem(sessionTimerStorageKey);

    TestBed.configureTestingModule({
      imports: [MockSessionTimerComponent],
      providers: [
        LuxAppHeaderAcSessionTimerService,
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MockSessionTimerComponent);
    component = fixture.componentInstance;
    timerService = TestBed.inject(LuxAppHeaderAcSessionTimerService);
    httpController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }));

  afterEach(() => {
    localStorage.removeItem(sessionTimerStorageKey);
  });

  it('sollte erstellt werden', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('sollte den Session Timer anzeigen, wenn eine start Zeit gesetzt wurde', fakeAsync(() => {
    expect(fixture.debugElement.query(By.css('lux-button'))).toBeNull();

    timerService.resetTimer(180);
    tick(100);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const timerButton = compiled.querySelector('lux-button');

    expect(timerButton).toBeTruthy();
  }));

  it('sollte einen Dialog öffnen, wenn eine start Zeit von unter 2 min gesetzt wurde', fakeAsync(() => {
    spyOn(timerService, 'openDialog');
    timerService.resetTimer(119);
    tick(100);
    fixture.detectChanges();

    expect(timerService.openDialog).toHaveBeenCalled();
  }));

  it('sollte den Dialog nicht erneut öffnen, wenn dieser geschlossen wurde, aber wieder öffnen wenn startingSeconds erneut gesetzt werden', fakeAsync(() => {
    let dialogOpenCount = 0;
    const openDialogSpy = spyOn(timerService, 'openDialog').and.callFake(() => {
      dialogOpenCount++;
    });

    // Dialog öffnet sich wenn Zeit gesetzt wird
    timerService.resetTimer(110);
    tick(100);
    fixture.detectChanges();
    expect(dialogOpenCount).toBe(1);

    // Dialog wird geschlossen
    openDialogSpy.calls.reset();
    dialogOpenCount = 0;

    // Timer läuft weiter, aber Dialog sollte nicht erneut geöffnet werden
    tick(100);
    fixture.detectChanges();
    expect(dialogOpenCount).toBe(0);

    // Dialog sollte jetzt wieder geöffnet werden wenn eine andere anzahl an Sekunden erneut gesetzt wird
    timerService.resetTimer(113);
    tick(100);
    fixture.detectChanges();
    expect(dialogOpenCount).toBe(1);
  }));

  it('sollte dialogWasClosed auf true lassen wenn canExtendSession false ist, ein Dialog geöffnet und geschlossen wurde und ein neuer Request reinkommt', fakeAsync(() => {
    timerService.canExtendSession = false;

    let dialogOpenCount = 0;
    spyOn(timerService, 'openDialog').and.callFake(() => {
      dialogOpenCount++;
      // Simuliert openNotExtendableDialog: Dialog schließt und setzt dialogWasClosed = true
      (timerService as any).dialogWasClosed = true;
    });

    // Timer unter 120s setzen – Dialog öffnet sich
    timerService.resetTimer(110);
    tick(100);
    fixture.detectChanges();

    expect(dialogOpenCount).toBe(1);
    expect((timerService as any).dialogWasClosed).toBeTrue();

    // Neuer Request: der Timer wird erneut gesetzt
    timerService.resetTimer(110);
    tick(1000);
    fixture.detectChanges();

    // dialogWasClosed sollte weiterhin true sein
    expect((timerService as any).dialogWasClosed).toBeTrue();
    // Dialog sollte nicht erneut geöffnet werden
    expect(dialogOpenCount).toBe(1);
  }));

  it('sollte den Session Timer verstecken wenn der Timer zurückgesetzt wird', fakeAsync(() => {
    timerService.resetTimer(180);
    tick(100);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('lux-button')).toBeTruthy();

    timerService.resetTimer(0);
    tick(100);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('lux-button')).toBeNull();
  }));

  it('sollte luxTimeoutEvent emittieren wenn der Timer abläuft', fakeAsync(() => {
    let timeoutFired = false;
    timerService.luxTimeoutEvent.subscribe(() => {
      timeoutFired = true;
    });

    timerService.resetTimer(2);
    tick(0); // Microtasks flushen → endTime = Date.now() + 2000, erste timer(0) Emission
    tick(1000); // 1s verbleibend → setTimeout(0) wird geplant
    tick(1); // setTimeout(0) feuert → timeoutUser()

    expect(timeoutFired).toBeTrue();
    expect(timerService.showSessionTimer()).toBeFalse();
  }));

  describe('BroadcastChannel Synchronisation', () => {
    let broadcastChannel: BroadcastChannel;

    beforeEach(() => {
      broadcastChannel = (timerService as any).broadcastChannel;
      spyOn(broadcastChannel, 'postMessage');
    });

    it('sollte einen BroadcastChannel erstellt haben', () => {
      expect(broadcastChannel).toBeTruthy();
    });

    it('sollte "dialog-closed" senden wenn timeoutUser aufgerufen wird', fakeAsync(() => {
      timerService.resetTimer(300);
      tick(0);

      timerService.timeoutUser();

      expect(broadcastChannel.postMessage).toHaveBeenCalledWith({ type: LuxSessionTimerBroadcastType.DECLINED });
    }));

    it('sollte "dialog-closed" senden wenn logoutUser aufgerufen wird', fakeAsync(() => {
      timerService.resetTimer(300);
      tick(0);

      timerService.logoutUser();

      expect(broadcastChannel.postMessage).toHaveBeenCalledWith({ type: LuxSessionTimerBroadcastType.DECLINED });
    }));

    it('sollte extendSessionTimer erfolgreich durchführen und Broadcast auslösen', fakeAsync(() => {
      const url = '/api/test/extend';
      timerService.url = url;
      timerService.resetTimer(300);
      tick(0);
      (broadcastChannel as any).postMessage.calls.reset();

      timerService.extendSessionTimer()?.subscribe();

      const req = httpController.expectOne(url);
      req.flush({});
      tick();

      // extendSessionTimer sendet broadcast in seinem map() Handler
      expect((broadcastChannel as any).postMessage).toHaveBeenCalledWith({ type: LuxSessionTimerBroadcastType.CONFIRMED });
    }));

    it('sollte extendSessionTimer mit HTTP-Fehler abfangen', fakeAsync(() => {
      const url = '/api/test/extend';
      timerService.url = url;
      timerService.resetTimer(300);
      tick(0);
      let errorCaught = false;

      timerService.extendSessionTimer()?.subscribe({
        error: () => {
          errorCaught = true;
        }
      });

      const req = httpController.expectOne(url);
      req.error(new ProgressEvent('error'));
      tick();

      expect(errorCaught).toBeTrue();
    }));

    it('sollte extendSessionTimer undefined zurückgeben wenn canExtendSession false ist', fakeAsync(() => {
      timerService.canExtendSession = false;
      timerService.resetTimer(300);
      tick(0);

      const result = timerService.extendSessionTimer();

      expect(result).toBeUndefined();
    }));

    it('sollte bei empfangener Nachricht den Dialog-Status zurücksetzen', fakeAsync(() => {
      (timerService as any).dialogIsOpen = true;
      (timerService as any).dialogWasClosed = false;

      (broadcastChannel as any).onmessage({ data: { type: LuxSessionTimerBroadcastType.DECLINED } });

      expect((timerService as any).dialogWasClosed).toBeTrue();
      expect((timerService as any).dialogIsOpen).toBeFalse();
    }));

    it('sollte den offenen Dialog mit "dismissed" schließen wenn "dialog-closed" empfangen wird', fakeAsync(() => {
      const mockDialogRef = jasmine.createSpyObj('dialogRef', ['closeDialog']);
      (timerService as any).currentDialogRef = mockDialogRef;
      (timerService as any).dialogIsOpen = true;

      (broadcastChannel as any).onmessage({ data: { type: LuxSessionTimerBroadcastType.DECLINED } });

      expect(mockDialogRef.closeDialog).toHaveBeenCalledWith('dismissed');
      expect((timerService as any).currentDialogRef).toBeNull();
    }));

    it('sollte clearTimer() aufgerufen können um Timer zu löschen', fakeAsync(() => {
      timerService.resetTimer(180);
      tick(100);
      expect(timerService.showSessionTimer()).toBeTrue();

      timerService.clearTimer();
      tick(100);

      expect(timerService.showSessionTimer()).toBeFalse();
      expect((timerService as any).endTime).toBe(0);
    }));
  });

  describe('Dialog Events', () => {
    it('sollte bei dialogClosed mit result !== "confirmed" broadcast auslösen', fakeAsync(() => {
      const broadcastChannel = (timerService as any).broadcastChannel;
      spyOn(broadcastChannel, 'postMessage');
      timerService.resetTimer(119);
      tick(100);
      fixture.detectChanges();
      (broadcastChannel as any).postMessage.calls.reset();

      const dialogRef = (timerService as any).currentDialogRef;
      if (dialogRef) {
        dialogRef._dialogClosed.next('dismissed');
        tick();

        expect((broadcastChannel as any).postMessage).toHaveBeenCalledWith({ type: LuxSessionTimerBroadcastType.DECLINED });
      }
    }));

    it('sollte openNotExtendableDialog mit setNotExtendableDialog aufrufen', fakeAsync(() => {
      timerService.canExtendSession = false;
      spyOn(timerService, 'openNotExtendableDialog').and.callThrough();

      timerService.resetTimer(119);
      tick(100);
      fixture.detectChanges();

      expect(timerService.openNotExtendableDialog).toHaveBeenCalled();
    }));
  });
});

@Component({
  template: ` <lux-app-header-ac-session-timer /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAppHeaderAcSessionTimerComponent]
})
class MockSessionTimerComponent {}
