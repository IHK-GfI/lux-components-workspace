import { describe, it, beforeEach, expect } from 'vitest';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LuxStepperLargeMobileOverlayService } from './lux-stepper-large-subcomponents/lux-stepper-large-mobile-overlay/lux-stepper-large-mobile-overlay.service';

import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxStepperLargeComponent } from './lux-stepper-large.component';

describe('LuxStepperLargeComponent', () => {
  let component: LuxStepperLargeComponent;
  let fixture: ComponentFixture<LuxStepperLargeComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [OverlayModule, LuxStepperLargeComponent],
      providers: [provideLuxTranslocoTesting(), LuxStepperLargeMobileOverlayService, LiveAnnouncer]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LuxStepperLargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
