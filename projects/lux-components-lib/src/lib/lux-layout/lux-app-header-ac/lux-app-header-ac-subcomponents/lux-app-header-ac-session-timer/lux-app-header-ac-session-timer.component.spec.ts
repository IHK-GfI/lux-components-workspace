import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { LuxAppHeaderAcSessionTimerComponent } from './lux-app-header-ac-session-timer.component';
import { LuxAppHeaderAcSessionTimerService } from './lux-app-header-ac-session-timer-service/lux-app-header-ac-session-timer.service';
import { Component, signal } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('LuxAppHeaderAcSessionTimerComponent', () => {
  let component: MockSessionTimerComponent;
  let fixture: ComponentFixture<MockSessionTimerComponent>;
  let timerService: LuxAppHeaderAcSessionTimerService;
  let httpController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MockSessionTimerComponent],
      providers: [LuxAppHeaderAcSessionTimerService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(MockSessionTimerComponent);
    component = fixture.componentInstance;
    timerService = TestBed.inject(LuxAppHeaderAcSessionTimerService);
    httpController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }));

  it('sollte erstellt werden', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('sollte den Session Timer anzeigen, wenn eine start Zeit gesetzt wurde', fakeAsync(() => {
    expect(fixture.debugElement.query(By.css('lux-button'))).toBeNull();

    timerService.startingSeconds.set(180);
    tick(100);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const timerButton = compiled.querySelector('lux-button');

    expect(timerButton).toBeTruthy();
  }));

  it('sollte den Session Timer nicht anzeigen, wenn eine start Zeit von über 60 min gesetzt wurde', fakeAsync(() => {
    expect(fixture.debugElement.query(By.css('lux-button'))).toBeNull();

    timerService.startingSeconds.set(3601);
    tick(100);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const timerButton = compiled.querySelector('lux-button');

    expect(timerButton).toBeFalsy();
  }));

  it('sollte einen Dialog öffnen, wenn eine start Zeit von über 2 min gesetzt wurde', fakeAsync(() => {
    spyOn(timerService, 'openDialog');
    timerService.startingSeconds.set(119);
    tick(100);
    fixture.detectChanges();

    expect(timerService.openDialog).toHaveBeenCalled();
  }));

  it('sollte ein Event werfen, wenn der User ausgeloggt wird', fakeAsync(() => {
    spyOn(timerService.luxLogoutEvent, 'emit');

    timerService.logout();

    expect(timerService.luxLogoutEvent.emit).toHaveBeenCalled();
  }));
});

@Component({
  template: ` <lux-app-header-ac-session-timer></lux-app-header-ac-session-timer> `,
  imports: [LuxAppHeaderAcSessionTimerComponent]
})
class MockSessionTimerComponent {}
