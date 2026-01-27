import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LuxAppHeaderAcSessionTimerDialogComponent, LuxSessionTimerDialogType } from './lux-app-header-ac-session-timer-dialog';
import { LuxAppHeaderAcSessionTimerService } from '../lux-app-header-ac-session-timer-service/lux-app-header-ac-session-timer.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LuxDialogRef } from '../../../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { By } from '@angular/platform-browser';

describe('LuxAppHeaderAcSessionTimerDialogComponent', () => {
  let component: LuxAppHeaderAcSessionTimerDialogComponent;
  let fixture: ComponentFixture<LuxAppHeaderAcSessionTimerDialogComponent>;
  let timerService: LuxAppHeaderAcSessionTimerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxAppHeaderAcSessionTimerDialogComponent],
      providers: [
        LuxAppHeaderAcSessionTimerService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: LuxDialogRef, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxAppHeaderAcSessionTimerDialogComponent);
    component = fixture.componentInstance;
    timerService = TestBed.inject(LuxAppHeaderAcSessionTimerService);
    fixture.detectChanges();
  });

  it('sollte erstellt werden', () => {
    expect(component).toBeTruthy();
  });

  it('sollte initial INFO-Dialog anzeigen', () => {
    expect(component.currentStep()).toBe(LuxSessionTimerDialogType.INFO);

    const infoDialog = fixture.debugElement.query(By.css('lux-dialog-structure[luxTagId="lux-session-timer-dialog-default"]'));
    expect(infoDialog).toBeTruthy();
  });

  it('sollte den Logout-Dialog anzeigen nach dem Abmelden', () => {
    spyOn(timerService, 'logoutUser');

    component.logoutUser();
    fixture.detectChanges();

    const logoutDialog = fixture.debugElement.query(By.css('lux-dialog-structure[luxTagId="lux-session-timer-dialog-logout"]'));
    expect(logoutDialog).toBeTruthy();
    expect(component.currentStep()).toBe(LuxSessionTimerDialogType.LOGOUT);
  });
});
