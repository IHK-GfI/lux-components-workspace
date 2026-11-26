import { describe, it, beforeEach, expect, vi } from 'vitest';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LuxStepperLargeMobileOverlayService } from './lux-stepper-large-subcomponents/lux-stepper-large-mobile-overlay/lux-stepper-large-mobile-overlay.service';

import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LUX_SNACKBAR_OPENER, LuxSnackbarOpener } from '../../lux-popups/lux-snackbar-opener/lux-snackbar-opener';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxStepperLargeComponent } from './lux-stepper-large.component';
import { LuxStepperLargeStepComponent } from './lux-stepper-large-subcomponents/lux-stepper-large-step/lux-stepper-large-step.component';

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

describe('LuxStepperLargeComponent - Meldung "Schritt unvollständig"', () => {
  const expectedText = 'Die Angaben in Schritt 1 sind unvollständig oder fehlerhaft. Bitte erst die Angaben in diesem Schritt korrigieren.';

  function setup(opener?: LuxSnackbarOpener) {
    TestBed.configureTestingModule({
      imports: [OverlayModule, MockStepperLargeComponent],
      providers: [
        provideLuxTranslocoTesting(),
        LuxStepperLargeMobileOverlayService,
        LiveAnnouncer,
        ...(opener ? [{ provide: LUX_SNACKBAR_OPENER, useValue: opener }] : [])
      ]
    });

    const fixture = TestBed.createComponent(MockStepperLargeComponent);
    fixture.detectChanges();
    return fixture.componentInstance.stepper();
  }

  it('Sollte die Meldung über LUX_SNACKBAR_OPENER anzeigen', () => {
    const opener: LuxSnackbarOpener = { open: vi.fn(() => ({ dismiss: vi.fn() })) };
    const stepper = setup(opener);

    stepper.onNavLink(1);

    expect(opener.open).toHaveBeenCalledWith(0, { text: expectedText, action: 'Ok', type: 'warning' });
    expect(stepper.currentStepNumber).toBe(0);
  });

  it('Sollte bei wiederholten Klicks die vorige Meldung schließen statt sie zu stapeln', () => {
    const refs = [{ dismiss: vi.fn() }, { dismiss: vi.fn() }];
    const opener: LuxSnackbarOpener = { open: vi.fn().mockReturnValueOnce(refs[0]).mockReturnValueOnce(refs[1]) };
    const stepper = setup(opener);

    stepper.onNavLink(1);
    stepper.onNavLink(1);

    expect(opener.open).toHaveBeenCalledTimes(2);
    expect(refs[0].dismiss).toHaveBeenCalledTimes(1);
    expect(refs[1].dismiss).not.toHaveBeenCalled();
  });

  it('Sollte die Meldung ohne LUX_SNACKBAR_OPENER per LiveAnnouncer ansagen', () => {
    const stepper = setup();
    const announceSpy = vi.spyOn(TestBed.inject(LiveAnnouncer), 'announce');

    stepper.onNavLink(1);

    expect(announceSpy).toHaveBeenCalledWith(expectedText, 'assertive');
    expect(stepper.currentStepNumber).toBe(0);
  });

  it('Sollte den fehlenden Provider nur einmal in der Konsole melden', () => {
    const stepper = setup();
    const warn = vi.fn();
    // warn ist ein Getter (liefert außerhalb des Debug-Modus noop).
    Object.defineProperty(TestBed.inject(LuxConsoleService), 'warn', { get: () => warn });

    stepper.onNavLink(1);
    stepper.onNavLink(1);

    expect(warn).toHaveBeenCalledTimes(1);
  });
});

@Component({
  template: `
    <lux-stepper-large>
      <lux-stepper-large-step luxTitle="Schritt 1" [luxCompleted]="false">Inhalt 1</lux-stepper-large-step>
      <lux-stepper-large-step luxTitle="Schritt 2">Inhalt 2</lux-stepper-large-step>
    </lux-stepper-large>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxStepperLargeComponent, LuxStepperLargeStepComponent]
})
class MockStepperLargeComponent {
  readonly stepper = viewChild.required(LuxStepperLargeComponent);
}
