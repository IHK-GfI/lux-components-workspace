import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LuxTextboxComponent } from './lux-textbox.component';

describe('LuxTextboxComponent', () => {
  let component: LuxTextboxComponent;
  let fixture: ComponentFixture<LuxTextboxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LuxTextboxComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
