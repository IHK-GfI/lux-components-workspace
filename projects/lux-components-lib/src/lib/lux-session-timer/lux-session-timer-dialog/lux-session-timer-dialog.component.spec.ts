import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxSessionTimerDialogComponent } from './lux-session-timer-dialog.component';

describe('LuxSessionTimerContactServerComponent', () => {
  let component: LuxSessionTimerDialogComponent;
  let fixture: ComponentFixture<LuxSessionTimerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxSessionTimerDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxSessionTimerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
