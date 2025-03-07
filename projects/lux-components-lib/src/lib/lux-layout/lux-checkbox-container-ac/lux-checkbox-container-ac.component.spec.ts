import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LuxCheckboxContainerAcComponent } from './lux-checkbox-container-ac.component';

describe('LuxCheckboxContainerComponent', () => {
  let component: LuxCheckboxContainerAcComponent;
  let fixture: ComponentFixture<LuxCheckboxContainerAcComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LuxCheckboxContainerAcComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxCheckboxContainerAcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
