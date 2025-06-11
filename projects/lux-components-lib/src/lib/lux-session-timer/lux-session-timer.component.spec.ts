import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LuxSessionTimerComponent } from './lux-session-timer.component';

describe('SessionTimerComponent', () => {
  let component: LuxSessionTimerComponent;
  let fixture: ComponentFixture<LuxSessionTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxSessionTimerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxSessionTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
