import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LuxAppHeaderAcSessionTimerDialogComponent, LuxSessionTimerDialogType } from './lux-app-header-ac-session-timer-dialog';
import { LuxAppHeaderAcSessionTimerService } from '../lux-app-header-ac-session-timer-service/lux-app-header-ac-session-timer.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LuxDialogRef } from '../../../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { By } from '@angular/platform-browser';
import { provideLuxTranslocoTesting } from '../../../../../../testing/transloco-test.provider';

describe('LuxAppHeaderAcSessionTimerDialogComponent', () => {
  let component: LuxAppHeaderAcSessionTimerDialogComponent;
  let fixture: ComponentFixture<LuxAppHeaderAcSessionTimerDialogComponent>;
  let timerService: LuxAppHeaderAcSessionTimerService;
  let dialogRefMock: { closeDialog: jasmine.Spy };
  let httpController: HttpTestingController;

  beforeEach(async () => {
    dialogRefMock = { closeDialog: jasmine.createSpy('closeDialog') };

    await TestBed.configureTestingModule({
      imports: [LuxAppHeaderAcSessionTimerDialogComponent],
      providers: [
        LuxAppHeaderAcSessionTimerService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: LuxDialogRef, useValue: dialogRefMock },
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxAppHeaderAcSessionTimerDialogComponent);
    component = fixture.componentInstance;
    timerService = TestBed.inject(LuxAppHeaderAcSessionTimerService);
    httpController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Ignore cancelled asset requests (e.g. transloco loaders), flushing them throws in HttpTestingController.
    httpController
      .match((req) => req.url.startsWith('/assets/'))
      .filter((req) => !req.cancelled)
      .forEach((req) => req.flush(''));
    httpController.verify();
  });

  it('sollte erstellt werden', () => {
    expect(component).toBeTruthy();
  });

  it('sollte initial INFO-Dialog anzeigen', () => {
    expect(component.currentStep()).toBe(LuxSessionTimerDialogType.INFO);

    const infoDialog = fixture.debugElement.query(By.css('lux-dialog-structure[luxTagId="lux-session-timer-dialog-default"]'));
    expect(infoDialog).toBeTruthy();
  });

  describe('INFO-Dialog', () => {
    it('sollte bei Klick auf Logout den Nutzer abmelden und den Dialog schließen', () => {
      spyOn(timerService, 'logoutUser');

      const logoutButton = fixture.debugElement.query(By.css('[luxTagId="lux-session-timer-button-logout"] button'));
      logoutButton.nativeElement.click();
      fixture.detectChanges();

      expect(timerService.logoutUser).toHaveBeenCalled();
      expect(dialogRefMock.closeDialog).toHaveBeenCalledWith('logout');
    });

    it('sollte zu WAIT wechseln wenn extendSession einen HTTP-Request startet', fakeAsync(() => {
      timerService.canExtendSession = true;
      timerService.url = '/session';

      const extendButton = fixture.debugElement.query(By.css('[luxTagId="lux-session-timer-button-extend-session"] button'));
      extendButton.nativeElement.click();

      // Signal ist synchron gesetzt – DOM-Update erst nach dem Flush, damit der Request nicht abgebrochen wird
      expect(component.currentStep()).toBe(LuxSessionTimerDialogType.WAIT);

      httpController.expectOne('/session').flush({});
      tick();

      // Da dialogRefMock.closeDialog nur ein Spy ist, bleibt currentStep auf WAIT
      fixture.detectChanges();
      const waitDialog = fixture.debugElement.query(By.css('lux-dialog-structure[luxTagId="lux-session-timer-dialog-wait"]'));
      expect(waitDialog).toBeTruthy();
    }));

    it('sollte Dialog mit "confirm" schließen wenn HTTP-Aufruf erfolgreich war', fakeAsync(() => {
      timerService.canExtendSession = true;
      timerService.url = '/session';

      const extendButton = fixture.debugElement.query(By.css('[luxTagId="lux-session-timer-button-extend-session"] button'));
      extendButton.nativeElement.click();

      httpController.expectOne('/session').flush({});
      tick();

      expect(dialogRefMock.closeDialog).toHaveBeenCalledWith('confirmed');
    }));

    it('sollte Dialog mit "error" schließen wenn HTTP-Aufruf fehlgeschlagen ist', fakeAsync(() => {
      timerService.canExtendSession = true;
      timerService.url = '/session';

      const extendButton = fixture.debugElement.query(By.css('[luxTagId="lux-session-timer-button-extend-session"] button'));
      extendButton.nativeElement.click();

      httpController.expectOne('/session').flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
      tick();

      expect(dialogRefMock.closeDialog).toHaveBeenCalledWith('error');
    }));
  });

  describe('Not-Extendable Dialog', () => {
    beforeEach(() => {
      component.setNotExtendableDialog();
      fixture.detectChanges();
    });

    it('sollte den NOTEXTENDABLE-Dialog anzeigen wenn setNotExtendableDialog aufgerufen wird', () => {
      expect(component.currentStep()).toBe(LuxSessionTimerDialogType.NOTEXTENDABLE);

      const notExtendableDialog = fixture.debugElement.query(By.css('lux-dialog-structure[luxTagId="lux-session-timer-dialog-logout"]'));
      expect(notExtendableDialog).toBeTruthy();
    });

    it('sollte den Logout-Button anzeigen', () => {
      const logoutButton = fixture.debugElement.query(By.css('[luxTagId="lux-session-timer-button-logout"]'));
      expect(logoutButton).toBeTruthy();
    });

    it('sollte den Bestätigen-Button anzeigen', () => {
      const confirmButton = fixture.debugElement.query(By.css('[luxTagId="lux-session-timer-button-confirm"]'));
      expect(confirmButton).toBeTruthy();
    });

    it('sollte bei Klick auf Logout den Nutzer abmelden und den Dialog schließen', () => {
      spyOn(timerService, 'logoutUser');

      const logoutButton = fixture.debugElement.query(By.css('[luxTagId="lux-session-timer-button-logout"] button'));
      logoutButton.nativeElement.click();
      fixture.detectChanges();

      expect(timerService.logoutUser).toHaveBeenCalled();
      expect(dialogRefMock.closeDialog).toHaveBeenCalledWith('logout');
    });

    it('sollte bei Klick auf Bestätigen den Dialog mit "confirmed" schließen', () => {
      const confirmButton = fixture.debugElement.query(By.css('[luxTagId="lux-session-timer-button-confirm"] button'));
      confirmButton.nativeElement.click();
      fixture.detectChanges();

      expect(dialogRefMock.closeDialog).toHaveBeenCalledWith('confirmed');
    });
  });
});
