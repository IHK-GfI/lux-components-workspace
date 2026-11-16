import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxA11yTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxButtonComponent } from './lux-button.component';

describe('LuxButtonComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideLuxTranslocoTesting()]
    }).compileComponents();
  });

  describe('Attribut "luxClicked"', () => {
    let fixture: ComponentFixture<MockButtonComponent>;
    let testComponent: MockButtonComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(MockButtonComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('Button (normal) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(false);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(false);
      fixture.detectChanges();

      Checker.checkLuxClicked(fixture);
    }));

    it('Button (raised) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised.set(true);
      fixture.componentInstance.round.set(false);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(false);
      fixture.detectChanges();

      Checker.checkLuxClicked(fixture);
    }));

    it('Button (round)" anklicken', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(true);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(false);
      fixture.detectChanges();

      Checker.checkLuxClicked(fixture);
    }));

    it('Button (flat) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(false);
      fixture.componentInstance.flat.set(true);
      fixture.componentInstance.outlined.set(false);
      fixture.detectChanges();

      Checker.checkLuxClicked(fixture);
    }));

    it('Button (stroked) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(false);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(true);
      fixture.detectChanges();

      Checker.checkLuxClicked(fixture);
    }));

    it('Button (stroked & rounded) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(true);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(true);
      fixture.detectChanges();

      Checker.checkLuxClicked(fixture);
    }));
  });

  describe('Attribut "luxDisabled"', () => {
    let fixture: ComponentFixture<MockButtonComponent>;
    let testComponent: MockButtonComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(MockButtonComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('Button (normal) anklicken', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(false);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(false);
      fixture.detectChanges();

      Checker.checkLuxDisabled(fixture);
    }));

    it('Button (raised) anklicken', fakeAsync(() => {
      fixture.componentInstance.raised.set(true);
      fixture.componentInstance.round.set(false);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(false);
      fixture.detectChanges();

      Checker.checkLuxDisabled(fixture);
    }));

    it('Button (round) anklicken', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(true);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(false);
      fixture.detectChanges();

      Checker.checkLuxDisabled(fixture);
    }));

    it('Button (flat) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(false);
      fixture.componentInstance.flat.set(true);
      fixture.componentInstance.outlined.set(false);
      fixture.detectChanges();

      Checker.checkLuxDisabled(fixture);
    }));

    it('Button (outlined) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(false);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(true);
      fixture.detectChanges();

      Checker.checkLuxDisabled(fixture);
    }));

    it('Button (outlined + rounded) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(true);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(true);
      fixture.detectChanges();

      Checker.checkLuxDisabled(fixture);
    }));
  });

  describe('Attribut "luxDisabledAria"', () => {
    let fixture: ComponentFixture<MockButtonComponent>;
    let testComponent: MockButtonComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(MockButtonComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('setzt aria-disabled nur bei Aktivierung', fakeAsync(() => {
      fixture.componentInstance.disabledAria.set(false);
      fixture.detectChanges();

      let buttonEl = fixture.debugElement.query(By.css('button'));
      expect(buttonEl.nativeElement.getAttribute('aria-disabled')).toBeNull();

      fixture.componentInstance.disabledAria.set(true);
      fixture.detectChanges();

      buttonEl = fixture.debugElement.query(By.css('button'));
      expect(buttonEl.nativeElement.getAttribute('aria-disabled')).toBe('true');
    }));

    it('setzt aria-disabled auch bei initial aktivem luxDisabledAria', fakeAsync(() => {
      // Regression: Das MatButton-Host-Binding für aria-disabled hat einen initial
      // gesetzten Wert im ersten Change-Detection-Zyklus wieder entfernt.
      const initialFixture = TestBed.createComponent(MockButtonComponent);
      initialFixture.componentInstance.disabledAria.set(true);
      initialFixture.detectChanges();

      const buttonEl = initialFixture.debugElement.query(By.css('button'));
      expect(buttonEl.nativeElement.getAttribute('aria-disabled')).toBe('true');
    }));

    it('emittiert luxClickNotAllowed und kein luxClicked', fakeAsync(() => {
      const onClickSpy = spyOn(fixture.componentInstance, 'onClick');
      const onClickNotAllowedSpy = spyOn(fixture.componentInstance, 'onClickNotAllowed');
      fixture.componentInstance.disabledAria.set(true);
      fixture.detectChanges();

      const buttonEl = fixture.debugElement.query(By.css('button'));
      buttonEl.nativeElement.click();
      fixture.detectChanges();

      expect(onClickSpy).not.toHaveBeenCalled();
      expect(onClickNotAllowedSpy).toHaveBeenCalled();
      discardPeriodicTasks();
    }));
  });

  describe('Attribut "luxLabel"', () => {
    let fixture: ComponentFixture<MockButtonLabelComponent>;
    let testComponent: MockButtonLabelComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(MockButtonLabelComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('Button (normal)"', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(false);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(false);
      fixture.detectChanges();

      Checker.checkLuxLabel(fixture);
    }));

    it('Button (raised)"', fakeAsync(() => {
      fixture.componentInstance.raised.set(true);
      fixture.componentInstance.round.set(false);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(false);
      fixture.detectChanges();

      Checker.checkLuxLabel(fixture);
    }));

    // Rounded Buttons haben keine Label mehr

    it('Button (flat) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(false);
      fixture.componentInstance.flat.set(true);
      fixture.componentInstance.outlined.set(false);
      fixture.detectChanges();

      Checker.checkLuxLabel(fixture);
    }));

    it('Button (outlined) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(false);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(true);
      fixture.detectChanges();

      Checker.checkLuxLabel(fixture);
    }));
  });

  describe('Attribut "luxLoading"', () => {
    let fixture: ComponentFixture<MockButtonLoadingComponent>;
    let testComponent: MockButtonLoadingComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(MockButtonLoadingComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('Button (normal) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(false);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(false);
      fixture.detectChanges();

      Checker.checkLuxLoading(fixture);
    }));

    it('Button (raised) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised.set(true);
      fixture.componentInstance.round.set(false);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(false);
      fixture.detectChanges();

      Checker.checkLuxLoading(fixture);
    }));

    it('Button (round)" anklicken', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(true);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(false);
      fixture.detectChanges();

      Checker.checkLuxLoading(fixture);
    }));

    it('Button (flat) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(false);
      fixture.componentInstance.flat.set(true);
      fixture.componentInstance.outlined.set(false);
      fixture.detectChanges();

      Checker.checkLuxLoading(fixture);
    }));

    it('Button (stroked) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(false);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(true);
      fixture.detectChanges();

      Checker.checkLuxLoading(fixture);
    }));

    it('Button (stroked & rounded) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(true);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(true);
      fixture.detectChanges();

      Checker.checkLuxLoading(fixture);
    }));
  });

  describe('Attribut "luxIconButton"', () => {
    let fixture: ComponentFixture<MockButtonComponent>;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(MockButtonComponent);
      fixture.componentInstance.iconButton.set(true);
      fixture.componentInstance.raised.set(false);
      fixture.componentInstance.round.set(false);
      fixture.componentInstance.flat.set(false);
      fixture.componentInstance.outlined.set(false);
      fixture.detectChanges();
    }));

    it('rendert die Icon-Button-Variante', fakeAsync(() => {
      const buttonEl = fixture.debugElement.query(By.css('button'));
      expect(buttonEl.nativeElement.classList).toContain('lux-button-icon-only');
      expect(buttonEl.nativeElement.classList).toContain('mat-mdc-icon-button');
    }));

    it('emittiert luxClicked bei Klick', fakeAsync(() => {
      Checker.checkLuxClicked(fixture);
    }));

    it('beachtet luxDisabled', fakeAsync(() => {
      Checker.checkLuxDisabled(fixture);
    }));
  });

  describe('A11y', () => {
    let fixture: ComponentFixture<MockA11yComponent>;
    let testComponent: MockA11yComponent;

    beforeAll(() => {
      LuxA11yTestHelper.addA11yMatchers();
    });

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(MockA11yComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('Button (normal) hat keine Barrierefreiheitsverletzungen', async () => {
      testComponent.raised.set(false);
      testComponent.round.set(false);
      testComponent.flat.set(false);
      testComponent.outlined.set(false);
      fixture.detectChanges();

      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);

      testComponent.disabled.set(true);
      testComponent.disabledAria.set(false);
      fixture.detectChanges();

      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);

      testComponent.disabled.set(false);
      testComponent.disabledAria.set(true);
      fixture.detectChanges();

      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('Button (raised) hat keine Barrierefreiheitsverletzungen', async () => {
      testComponent.raised.set(true);
      testComponent.round.set(false);
      testComponent.flat.set(false);
      testComponent.outlined.set(false);
      fixture.detectChanges();

      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('Button (round) hat keine Barrierefreiheitsverletzungen', async () => {
      testComponent.raised.set(false);
      testComponent.round.set(true);
      testComponent.flat.set(false);
      testComponent.outlined.set(false);
      fixture.detectChanges();

      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('Button (flat) hat keine Barrierefreiheitsverletzungen', async () => {
      testComponent.raised.set(false);
      testComponent.round.set(false);
      testComponent.flat.set(true);
      testComponent.outlined.set(false);
      fixture.detectChanges();

      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('Button (stroked) hat keine Barrierefreiheitsverletzungen', async () => {
      testComponent.raised.set(false);
      testComponent.round.set(false);
      testComponent.flat.set(false);
      testComponent.outlined.set(true);
      fixture.detectChanges();

      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('Button (stroked & rounded) hat keine Barrierefreiheitsverletzungen', async () => {
      testComponent.raised.set(false);
      testComponent.round.set(true);
      testComponent.flat.set(false);
      testComponent.outlined.set(true);
      fixture.detectChanges();

      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('Button (iconButton) hat keine Barrierefreiheitsverletzungen', async () => {
      testComponent.iconButton.set(true);
      testComponent.raised.set(false);
      testComponent.round.set(false);
      testComponent.flat.set(false);
      testComponent.outlined.set(false);
      fixture.detectChanges();

      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });
  });
});

class Checker {
  static checkLuxLabel(fixture: ComponentFixture<MockButtonLabelComponent>) {
    // Vorbedingungen testen
    const expectedLabel = 'Testbutton 123';
    expect(fixture.componentInstance.label()).toEqual('');

    // Änderungen durchführen
    fixture.componentInstance.label.set(expectedLabel);
    fixture.detectChanges();

    const labelEl = fixture.debugElement.query(By.css('span[class~="lux-button-label"]'));
    fixture.detectChanges();

    // Nachbedingungen testen
    expect(fixture.componentInstance.label()).toEqual(expectedLabel);
    expect(labelEl.nativeElement.innerHTML.trim()).toEqual(expectedLabel);
  }

  static checkLuxClicked(fixture: ComponentFixture<MockButtonComponent>) {
    // Vorbedingungen testen
    const onClickSpy = spyOn(fixture.componentInstance, 'onClick');
    expect(fixture.componentInstance.disabled()).toBeFalse();

    // Änderungen durchführen
    fixture.componentInstance.disabled.set(false);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('button'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();

    // Nachbedingungen testen
    expect(fixture.componentInstance.disabled()).toBeFalsy();
    expect(buttonEl.nativeElement.disabled).toBeFalsy();
    expect(buttonEl.nativeElement.getAttribute('aria-label')).toContain('Lorem ipsum 4711');
    expect(onClickSpy).toHaveBeenCalled();
    discardPeriodicTasks();
  }

  static checkLuxDisabled(fixture: ComponentFixture<MockButtonComponent>) {
    // Vorbedingungen testen
    const onClickSpy = spyOn(fixture.componentInstance, 'onClick');
    expect(fixture.componentInstance.disabled()).toBeFalse();

    // Änderungen durchführen
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('button'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();

    // Nachbedingungen testen
    expect(fixture.componentInstance.disabled()).toBeTruthy();
    expect(buttonEl.nativeElement.disabled).toBeTruthy();
    expect(buttonEl.nativeElement.getAttribute('aria-label')).toContain('Lorem ipsum 4711');
    expect(onClickSpy).not.toHaveBeenCalled();
  }

  static checkLuxLoading(fixture: ComponentFixture<MockButtonLoadingComponent>) {
    // Vorbedingungen testen
    const onClickSpy = spyOn(fixture.componentInstance, 'onClick');
    const buttonLoadingEl = fixture.debugElement.query(By.css('lux-progress'));
    expect(buttonLoadingEl).toBeNull();

    // Änderungen durchführen
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('button'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();

    // Nachbedingungen testen
    const buttonLoadingChangeEl = fixture.debugElement.query(By.css('lux-progress'));
    expect(buttonLoadingChangeEl).not.toBeNull();
    expect(onClickSpy).toHaveBeenCalled();
    discardPeriodicTasks();
  }
}

@Component({
  template: `
    <lux-button
      luxLabel="Lorem ipsum 4711"
      [luxDisabled]="disabled()"
      [luxDisabledAria]="disabledAria()"
      (luxClicked)="onClick()"
      (luxClickNotAllowed)="onClickNotAllowed()"
      [luxRounded]="round()"
      [luxRaised]="raised()"
      [luxFlat]="flat()"
      [luxStroked]="outlined()"
      [luxIconButton]="iconButton()"
    ></lux-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxButtonComponent]
})
class MockButtonComponent {
  disabled = signal(false);
  disabledAria = signal(false);
  round = signal(false);
  raised = signal(false);
  flat = signal(false);
  outlined = signal(false);
  iconButton = signal(false);

  onClick() {}
  onClickNotAllowed() {}
}

@Component({
  template: `
    <lux-button
      [luxLabel]="label()"
      [luxDisabled]="disabled()"
      (luxClicked)="onClick()"
      [luxRounded]="round()"
      [luxRaised]="raised()"
      [luxFlat]="flat()"
      [luxStroked]="outlined()"
      [luxIconButton]="iconButton()"
    ></lux-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxButtonComponent]
})
class MockButtonLabelComponent {
  disabled = signal(false);
  round = signal(false);
  raised = signal(false);
  label = signal('');
  flat = signal(false);
  outlined = signal(false);
  iconButton = signal(false);

  onClick() {}
}

@Component({
  template: `
    <lux-button
      [luxLabel]="label()"
      [luxDisabled]="disabled()"
      (luxClicked)="onClick()"
      [luxRounded]="round()"
      [luxRaised]="raised()"
      [luxFlat]="flat()"
      [luxStroked]="outlined()"
      [luxIconButton]="iconButton()"
      [luxLoading]="loading()"
    ></lux-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxButtonComponent]
})
class MockButtonLoadingComponent {
  disabled = signal(false);
  round = signal(false);
  raised = signal(false);
  label = signal('');
  flat = signal(false);
  outlined = signal(false);
  iconButton = signal(false);
  loading = signal(false);

  onClick() {}
}

@Component({
  template: `
    <lux-button
      luxLabel="Lorem ipsum 4711"
      [luxDisabled]="disabled()"
      [luxDisabledAria]="disabledAria()"
      [luxRounded]="round()"
      [luxRaised]="raised()"
      [luxFlat]="flat()"
      [luxStroked]="outlined()"
      [luxIconButton]="iconButton()"
    ></lux-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxButtonComponent]
})
class MockA11yComponent {
  disabled = signal(false);
  disabledAria = signal(false);
  round = signal(false);
  raised = signal(false);
  flat = signal(false);
  outlined = signal(false);
  iconButton = signal(false);
}
