import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  beforeEach(async () => {
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
  });

  afterEach(() => {
    localStorage.removeItem(sessionTimerStorageKey);
  });

  it('sollte erstellt werden', async () => {
    expect(component).toBeTruthy();
  });

  it('sollte den Session Timer anzeigen, wenn eine start Zeit gesetzt wurde', async () => {
    expect(fixture.debugElement.query(By.css('lux-button'))).toBeNull();

    timerService.resetTimer(180);
    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const timerButton = compiled.querySelector('lux-button');

    expect(timerButton).toBeTruthy();
  });

  it('sollte einen Dialog öffnen, wenn eine start Zeit von unter 2 min gesetzt wurde', async () => {
    vi.spyOn(timerService, 'openDialog').mockReturnValue(undefined);
    timerService.resetTimer(119);
    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();

    expect(timerService.openDialog).toHaveBeenCalled();
  });

  it('sollte den Dialog nicht erneut öffnen, wenn dieser geschlossen wurde, aber wieder öffnen wenn startingSeconds erneut gesetzt werden', async () => {
    let dialogOpenCount = 0;
    const openDialogSpy = vi.spyOn(timerService, 'openDialog').mockImplementation(() => {
      dialogOpenCount++;
    });

    // Dialog öffnet sich wenn Zeit gesetzt wird
    timerService.resetTimer(110);
    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();
    expect(dialogOpenCount).toBe(1);

    // Dialog wird geschlossen
    openDialogSpy.mockClear();
    dialogOpenCount = 0;

    // Timer läuft weiter, aber Dialog sollte nicht erneut geöffnet werden
    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();
    expect(dialogOpenCount).toBe(0);

    // Dialog sollte jetzt wieder geöffnet werden wenn eine andere anzahl an Sekunden erneut gesetzt wird
    timerService.resetTimer(113);
    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();
    expect(dialogOpenCount).toBe(1);
  });

  it('sollte dialogWasClosed auf true lassen wenn canExtendSession false ist, ein Dialog geöffnet und geschlossen wurde und ein neuer Request reinkommt', async () => {
    timerService.canExtendSession = false;

    let dialogOpenCount = 0;
    vi.spyOn(timerService, 'openDialog').mockImplementation(() => {
      dialogOpenCount++;
      // Simuliert openNotExtendableDialog: Dialog schließt und setzt dialogWasClosed = true
      (timerService as any).dialogWasClosed = true;
    });

    // Timer unter 120s setzen – Dialog öffnet sich
    timerService.resetTimer(110);
    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();

    expect(dialogOpenCount).toBe(1);
    expect((timerService as any).dialogWasClosed).toBe(true);

    // Neuer Request: der Timer wird erneut gesetzt
    timerService.resetTimer(110);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    fixture.detectChanges();

    // dialogWasClosed sollte weiterhin true sein
    expect((timerService as any).dialogWasClosed).toBe(true);
    // Dialog sollte nicht erneut geöffnet werden
    expect(dialogOpenCount).toBe(1);
  });

  it('sollte den Session Timer verstecken wenn der Timer zurückgesetzt wird', async () => {
    timerService.resetTimer(180);
    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('lux-button')).toBeTruthy();

    timerService.resetTimer(0);
    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('lux-button')).toBeNull();
  });

  it('sollte luxTimeoutEvent emittieren wenn der Timer abläuft', async () => {
    let timeoutFired = false;
    timerService.luxTimeoutEvent.subscribe(() => {
      timeoutFired = true;
    });

    timerService.resetTimer(2);
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges(); // Microtasks flushen → endTime = Date.now() + 2000, erste timer(0) Emission
    // toObservable() koppelt das Signal per effect() an ein Observable; effect() läuft erst nach dem
    // aktuellen Change-Detection-Zyklus (nicht synchron), wodurch die interne timer(0, 1000)-Subscription
    // etwas später als beim synchronen Aufruf von resetTimer() startet. Der 1000ms/1ms-Zeitplan hier ist
    // daher mit Sicherheitsmarge versehen, statt exakt auf die interne Taktung zu vertrauen.
    await new Promise((resolve) => setTimeout(resolve, 1300));
    fixture.detectChanges(); // 1s verbleibend → setTimeout(0) wird geplant
    await new Promise((resolve) => setTimeout(resolve, 50));
    fixture.detectChanges(); // setTimeout(0) feuert → timeoutUser()

    expect(timeoutFired).toBe(true);
    expect(timerService.showSessionTimer()).toBe(false);
  });

  describe('BroadcastChannel Synchronisation', () => {
    let broadcastChannel: BroadcastChannel;

    beforeEach(() => {
      broadcastChannel = (timerService as any).broadcastChannel;
      vi.spyOn(broadcastChannel, 'postMessage').mockReturnValue(undefined);
    });

    it('sollte einen BroadcastChannel erstellt haben', () => {
      expect(broadcastChannel).toBeTruthy();
    });

    it('sollte "dialog-closed" senden wenn timeoutUser aufgerufen wird', async () => {
      timerService.resetTimer(300);
      fixture.detectChanges();

      timerService.timeoutUser();

      expect(broadcastChannel.postMessage).toHaveBeenCalledWith({ type: LuxSessionTimerBroadcastType.DECLINED });
    });

    it('sollte "dialog-closed" senden wenn logoutUser aufgerufen wird', async () => {
      timerService.resetTimer(300);
      fixture.detectChanges();

      timerService.logoutUser();

      expect(broadcastChannel.postMessage).toHaveBeenCalledWith({ type: LuxSessionTimerBroadcastType.DECLINED });
    });

    it('sollte extendSessionTimer erfolgreich durchführen und Broadcast auslösen', async () => {
      const url = '/api/test/extend';
      timerService.url = url;
      timerService.resetTimer(300);
      fixture.detectChanges();
      (broadcastChannel as any).postMessage.mockClear();

      timerService.extendSessionTimer()?.subscribe();

      const req = httpController.expectOne(url);
      req.flush({});
      fixture.detectChanges();

      // extendSessionTimer sendet broadcast in seinem map() Handler
      expect((broadcastChannel as any).postMessage).toHaveBeenCalledWith({ type: LuxSessionTimerBroadcastType.CONFIRMED });
    });

    it('sollte extendSessionTimer mit HTTP-Fehler abfangen', async () => {
      const url = '/api/test/extend';
      timerService.url = url;
      timerService.resetTimer(300);
      fixture.detectChanges();
      let errorCaught = false;

      timerService.extendSessionTimer()?.subscribe({
        error: () => {
          errorCaught = true;
        }
      });

      const req = httpController.expectOne(url);
      req.error(new ProgressEvent('error'));
      fixture.detectChanges();

      expect(errorCaught).toBe(true);
    });

    it('sollte extendSessionTimer undefined zurückgeben wenn canExtendSession false ist', async () => {
      timerService.canExtendSession = false;
      timerService.resetTimer(300);
      fixture.detectChanges();

      const result = timerService.extendSessionTimer();

      expect(result).toBeUndefined();
    });

    it('sollte bei empfangener Nachricht den Dialog-Status zurücksetzen', async () => {
      (timerService as any).dialogIsOpen = true;
      (timerService as any).dialogWasClosed = false;

      (broadcastChannel as any).onmessage({ data: { type: LuxSessionTimerBroadcastType.DECLINED } });

      expect((timerService as any).dialogWasClosed).toBe(true);
      expect((timerService as any).dialogIsOpen).toBe(false);
    });

    it('sollte den offenen Dialog mit "dismissed" schließen wenn "dialog-closed" empfangen wird', async () => {
      const mockDialogRef = {
        closeDialog: vi.fn().mockName('dialogRef.closeDialog')
      };
      (timerService as any).currentDialogRef = mockDialogRef;
      (timerService as any).dialogIsOpen = true;

      (broadcastChannel as any).onmessage({ data: { type: LuxSessionTimerBroadcastType.DECLINED } });

      expect(mockDialogRef.closeDialog).toHaveBeenCalledWith('dismissed');
      expect((timerService as any).currentDialogRef).toBeNull();
    });

    it('sollte clearTimer() aufgerufen können um Timer zu löschen', async () => {
      timerService.resetTimer(180);
      await new Promise((resolve) => setTimeout(resolve, 100));
      fixture.detectChanges();
      expect(timerService.showSessionTimer()).toBe(true);

      timerService.clearTimer();
      await new Promise((resolve) => setTimeout(resolve, 100));
      fixture.detectChanges();

      expect(timerService.showSessionTimer()).toBe(false);
      expect((timerService as any).endTime).toBe(0);
    });
  });

  describe('Dialog Events', () => {
    it('sollte bei dialogClosed mit result !== "confirmed" broadcast auslösen', async () => {
      const broadcastChannel = (timerService as any).broadcastChannel;
      vi.spyOn(broadcastChannel, 'postMessage').mockReturnValue(undefined);
      timerService.resetTimer(119);
      await new Promise((resolve) => setTimeout(resolve, 100));
      fixture.detectChanges();
      (broadcastChannel as any).postMessage.mockClear();

      const dialogRef = (timerService as any).currentDialogRef;
      if (dialogRef) {
        dialogRef._dialogClosed.next('dismissed');
        fixture.detectChanges();

        expect((broadcastChannel as any).postMessage).toHaveBeenCalledWith({ type: LuxSessionTimerBroadcastType.DECLINED });
      }
    });

    it('sollte openNotExtendableDialog mit setNotExtendableDialog aufrufen', async () => {
      timerService.canExtendSession = false;
      vi.spyOn(timerService, 'openNotExtendableDialog');

      timerService.resetTimer(119);
      await new Promise((resolve) => setTimeout(resolve, 100));
      fixture.detectChanges();

      expect(timerService.openNotExtendableDialog).toHaveBeenCalled();
    });
  });
});

@Component({
  template: ` <lux-app-header-ac-session-timer /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAppHeaderAcSessionTimerComponent]
})
class MockSessionTimerComponent {}
