import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LuxAppHeaderAcSessionTimerDialogComponent } from './lux-app-header-ac-session-timer-dialog.component';
import { LuxAppHeaderAcSessionTimerService } from '../lux-app-header-ac-session-timer-service/lux-app-header-ac-session-timer.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LuxAppHeaderAcSessionTimerDialogComponent', () => {
  let component: LuxAppHeaderAcSessionTimerDialogComponent;
  let fixture: ComponentFixture<LuxAppHeaderAcSessionTimerDialogComponent>;
  let timerService: LuxAppHeaderAcSessionTimerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxAppHeaderAcSessionTimerDialogComponent],
      providers: [LuxAppHeaderAcSessionTimerService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxAppHeaderAcSessionTimerDialogComponent);
    component = fixture.componentInstance;
    timerService = TestBed.inject(LuxAppHeaderAcSessionTimerService);
    fixture.detectChanges();
  });

  it('sollte erstellt werden', () => {
    expect(component).toBeTruthy();
  });
});
