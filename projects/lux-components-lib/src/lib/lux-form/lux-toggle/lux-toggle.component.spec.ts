import { describe, it, beforeAll, beforeEach, afterEach, expect, vi } from 'vitest';
// noinspection DuplicatedCode

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxA11yTestHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { ValidatorFnType } from '../lux-form-model/lux-form-component-base.class';
import { LuxToggleComponent } from './lux-toggle.component';

describe('LuxToggleComponent', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  });

  afterEach(async () => {
    if (vi.isFakeTimers()) {
      await vi.runAllTimersAsync();
    }
    vi.useRealTimers();
  });

  describe('innerhalb eines Formulars', () => {
    describe('FormGroup (not required)"', () => {
      let fixture: ComponentFixture<LuxToggleInFormAttributeComponent>;
      let testComponent: LuxToggleInFormAttributeComponent;

      beforeEach(async () => {
        fixture = TestBed.createComponent(LuxToggleInFormAttributeComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      });

      it('Formularwert über die Component setzen', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toEqual(true);

        // Änderungen durchführen
        fixture.componentInstance.formGroup.get('eula')!.setValue(false);
        fixture.detectChanges();

        // Nachbedingungen testen
        const toggleEl = fixture.debugElement.query(By.css('button'));
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeFalsy();
        expect(toggleEl.nativeElement.classList).toContain('mdc-switch--unselected');
        expect(toggleEl.nativeElement.required).toBeFalsy();
      });
    });

    describe('FormGroup (required)"', () => {
      let fixture: ComponentFixture<LuxToggleRequiredInFormAttributeComponent>;
      let testComponent: LuxToggleRequiredInFormAttributeComponent;

      beforeEach(async () => {
        fixture = TestBed.createComponent(LuxToggleRequiredInFormAttributeComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      });

      it('Formularwert über die Component setzen', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toEqual(null);

        // Änderungen durchführen
        fixture.componentInstance.formGroup.get('eula')!.setValue(true);
        fixture.detectChanges();

        // Nachbedingungen testen
        const toggleEl = fixture.debugElement.query(By.css('button'));
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeTruthy();
        expect(toggleEl.nativeElement.classList).toContain('mdc-switch--selected');
      });

      it('Label anklicken', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeFalsy();

        // Änderungen durchführen
        const toggleEl = fixture.debugElement.query(By.css('label'));
        toggleEl.nativeElement.click();
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeTruthy();
      });

      it('Toggle anklicken', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeFalsy();

        // Änderungen durchführen
        const toggleEl = fixture.debugElement.query(By.css('button'));
        toggleEl.nativeElement.click();
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeTruthy();
      });

      it('Toggle anklicken schreibt den Wert synchron ins FormControl', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeFalsy();

        // Änderungen durchführen (bewusst OHNE detectChanges: kein Warten auf einen Effect)
        const toggleEl = fixture.debugElement.query(By.css('button'));
        toggleEl.nativeElement.click();

        // Nachbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBe(true);
      });

      it('Sollte die korrekte Fehlermeldung anzeigen', () => {
        let errorElement = fixture.debugElement.query(By.css('mat-error'));

        // Vorbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeFalsy();
        expect(errorElement).toBeNull();

        // Änderungen durchführen
        testComponent.formGroup.get('eula')!.markAsTouched();
        fixture.detectChanges();

        // Nachbedingungen testen
        errorElement = fixture.debugElement.query(By.css('mat-error'));
        expect(errorElement.nativeElement.innerText.trim()).toEqual('Das ist ein Pflichtfeld');
      });

      it('Sollte einen Fehler bei Startwert "" anzeigen können', async () => {
        testComponent.formGroup.get('eula')!.setValue('');
        let errorElement = fixture.debugElement.query(By.css('mat-error'));
        fixture.detectChanges();

        // Vorbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeFalsy();
        expect(errorElement).toBeNull();

        // Änderungen durchführen
        testComponent.formGroup.get('eula')!.markAsTouched();
        fixture.detectChanges();

        // Nachbedingungen testen
        errorElement = fixture.debugElement.query(By.css('mat-error'));
        expect(errorElement.nativeElement.innerText.trim()).toEqual('Das ist ein Pflichtfeld');
      });

      it('Sollte einen Fehler bei Startwert false anzeigen können', async () => {
        testComponent.formGroup.get('eula')!.setValue(false);
        let errorElement = fixture.debugElement.query(By.css('mat-error'));
        fixture.detectChanges();

        // Vorbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeFalsy();
        expect(errorElement).toBeNull();

        // Änderungen durchführen
        testComponent.formGroup.get('eula')!.markAsTouched();
        fixture.detectChanges();

        // Nachbedingungen testen
        errorElement = fixture.debugElement.query(By.css('mat-error'));
        expect(errorElement.nativeElement.innerText.trim()).toEqual('Das ist ein Pflichtfeld');
      });

      it('Sollte einen Fehler bei Startwert true anzeigen können', async () => {
        testComponent.formGroup.get('eula')!.setValue(true);
        let errorElement = fixture.debugElement.query(By.css('mat-error'));
        fixture.detectChanges();

        // Vorbedingungen testen
        expect(fixture.componentInstance.formGroup.get('eula')!.value).toBeTruthy();
        expect(errorElement).toBeNull();

        // Änderungen durchführen
        testComponent.formGroup.get('eula')!.setValue(false);
        testComponent.formGroup.get('eula')!.markAsTouched();
        fixture.detectChanges();

        // Nachbedingungen testen
        errorElement = fixture.debugElement.query(By.css('mat-error'));
        expect(errorElement.nativeElement.innerText.trim()).toEqual('Das ist ein Pflichtfeld');
      });
    });
  });

  describe('außerhalb eines Formulars', () => {
    describe('Attribut "luxChecked" mit Two-Way-Binding', () => {
      let fixture: ComponentFixture<LuxCheckedAttributeComponent>;
      let testComponent: LuxCheckedAttributeComponent;

      beforeEach(async () => {
        fixture = TestBed.createComponent(LuxCheckedAttributeComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      });

      it('Wert über die Component setzen', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.eula()).toBeUndefined();

        // Änderungen durchführen
        fixture.componentInstance.eula.set(true);
        fixture.detectChanges();

        // Nachbedingungen testen
        const toggleEl = fixture.debugElement.query(By.css('button'));
        expect(toggleEl.nativeElement.classList).toContain('mdc-switch--selected');
      });

      it('Label anklicken', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.eula()).toBeFalsy();

        // Änderungen durchführen
        const toggleEl = fixture.debugElement.query(By.css('label'));
        toggleEl.nativeElement.click();
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(fixture.componentInstance.eula()).toBeTruthy();
      });

      it('Toggle anklicken', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.eula()).toBeFalsy();

        // Änderungen durchführen
        const toggleEl = fixture.debugElement.query(By.css('button'));
        toggleEl.nativeElement.click();
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(fixture.componentInstance.eula()).toBeTruthy();
      });
    });

    describe('Attribut "luxDisabled"', () => {
      let fixture: ComponentFixture<LuxDisabledAttributeComponent>;
      let testComponent: LuxDisabledAttributeComponent;

      beforeEach(async () => {
        fixture = TestBed.createComponent(LuxDisabledAttributeComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      });

      it('Wert über die Component setzen', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.disabled()).toBeFalsy();

        // Änderungen durchführen
        fixture.componentInstance.disabled.set(true);
        fixture.detectChanges();

        const toggleEl = fixture.debugElement.query(By.css('button'));
        toggleEl.nativeElement.click();
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(fixture.componentInstance.disabled()).toBeTruthy();
        expect(toggleEl.nativeElement.disabled).toBeTruthy();
      });
    });

    describe('Attribut "luxLabel"', () => {
      let fixture: ComponentFixture<LuxLabelAttributeComponent>;
      let testComponent: LuxLabelAttributeComponent;

      beforeEach(async () => {
        fixture = TestBed.createComponent(LuxLabelAttributeComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      });

      it('Wert über die Component setzen', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.label()).toBeFalsy();

        // Änderungen durchführen
        const newLabel = 'A4711';
        fixture.componentInstance.label.set(newLabel);
        fixture.detectChanges();

        const labelEl = fixture.debugElement.query(By.css('label'));
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(fixture.componentInstance.label()).toEqual(newLabel);
        expect(labelEl.nativeElement.innerHTML.trim().indexOf(newLabel) !== -1).toBeTruthy();
      });
    });

    describe('Attribut "luxCheckedChange"', () => {
      let fixture: ComponentFixture<LuxCheckedChangeComponent>;
      let testComponent: LuxCheckedChangeComponent;

      beforeEach(async () => {
        fixture = TestBed.createComponent(LuxCheckedChangeComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      });

      it('Check Event', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.eula).toBeNull();

        // Änderungen durchführen
        // 1. Click => true
        const toggleEl = fixture.debugElement.query(By.css('button'));
        toggleEl.nativeElement.click();
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(fixture.componentInstance.eula).toBeTruthy();

        // Änderungen durchführen
        // 2. Click => false
        toggleEl.nativeElement.click();
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(fixture.componentInstance.eula).toBeFalsy();
      });

      it('Sollte den Change-Event nach einer stillen (emitEvent:false) Wertänderung nicht verschlucken', async () => {
        const toggleComponent: LuxToggleComponent = fixture.debugElement.query(By.directive(LuxToggleComponent)).componentInstance;
        const toggleEl = fixture.debugElement.query(By.css('button'));
        const changeSpy = vi.spyOn(testComponent, 'onCheckedChange');

        // Änderungen durchführen
        // 1. Click => true (echte User-Interaktion, löst Change-Event aus)
        toggleEl.nativeElement.click();
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(fixture.componentInstance.eula).toBeTruthy();

        // Änderungen durchführen
        // 2. Wert intern ohne Event auf false setzen (z.B. um eine Two-Way-Binding-Loop zu brechen)
        toggleComponent.formControl.setValue(false, { emitEvent: false });
        fixture.detectChanges();

        // Nachbedingungen testen: Kein zusätzlicher Change-Event, da bewusst ohne emit gesetzt
        expect(changeSpy).toHaveBeenCalledTimes(1);

        // Änderungen durchführen
        // 3. Click => true (echte User-Interaktion, muss trotz identischem End-Wert erneut feuern)
        toggleEl.nativeElement.click();
        fixture.detectChanges();

        // Nachbedingungen testen
        expect(changeSpy).toHaveBeenCalledTimes(2);
        expect(fixture.componentInstance.eula).toBeTruthy();
      });
    });

    describe('Attribut "luxRequired"', () => {
      let fixture: ComponentFixture<LuxRequiredAttributeComponent>;
      let testComponent: LuxRequiredAttributeComponent;
      let toggleComponent: LuxToggleComponent;

      beforeEach(async () => {
        fixture = TestBed.createComponent(LuxRequiredAttributeComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
        toggleComponent = fixture.debugElement.query(By.directive(LuxToggleComponent)).componentInstance;
      });

      it('Sollte die korrekte Fehlermeldung anzeigen', async () => {
        let errorElement = fixture.debugElement.query(By.css('mat-error'));

        // Vorbedingungen testen
        expect(errorElement).toBeNull();

        // Änderungen durchführen
        toggleComponent.formControl.markAsTouched();
        fixture.detectChanges();

        // Nachbedingungen testen
        errorElement = fixture.debugElement.query(By.css('mat-error'));
        expect(errorElement.nativeElement.innerText.trim()).toEqual('Das ist ein Pflichtfeld');
      });
    });

    describe('Two-Way-Binding "checked" mit Attribut "luxRequired"', () => {
      let fixture: ComponentFixture<LuxCheckedRequiredAttributeComponent>;

      beforeEach(async () => {
        fixture = TestBed.createComponent(LuxCheckedRequiredAttributeComponent);
        fixture.detectChanges();
      });

      it('Sollte den gebundenen Startwert behalten', async () => {
        // Regression: Allein durch luxRequired galt die Brücke als zuständig und überschrieb das gebundene
        // checked beim Initialisieren mit dem (nie gebundenen) Alt-Input luxChecked = undefined.
        expect(fixture.componentInstance.checked()).toBe(true);
        expect(fixture.debugElement.query(By.css('button')).nativeElement.classList).toContain('mdc-switch--selected');
      });

      it('Sollte nach dem Abwählen und erneuten Auswählen den Wert übernehmen', async () => {
        const buttonEl = fixture.debugElement.query(By.css('button')).nativeElement;

        buttonEl.click();
        fixture.detectChanges();
        expect(fixture.componentInstance.checked()).toBe(false);

        buttonEl.click();
        fixture.detectChanges();
        expect(fixture.componentInstance.checked()).toBe(true);
      });
    });

    describe('Error-Message', () => {
      let fixture: ComponentFixture<LuxValidatorsComponent>;
      let testComponent: LuxValidatorsComponent;
      let toggleComponent: LuxToggleComponent;

      beforeEach(async () => {
        fixture = TestBed.createComponent(LuxValidatorsComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
        toggleComponent = fixture.debugElement.query(By.directive(LuxToggleComponent)).componentInstance;
      });

      it('Validatoren setzen und die Fehlermeldungen korrekt anzeigen', async () => {
        // Vorbedingungen testen
        let errorEl = fixture.debugElement.query(By.css('mat-error'));
        expect(errorEl).toBeNull();

        // Änderungen durchführen
        testComponent.validators.set(Validators.required);
        fixture.detectChanges();
        toggleComponent.formControl.markAsTouched();
        toggleComponent.formControl.updateValueAndValidity();
        await LuxTestHelper.wait(fixture, 100);

        // Nachbedingungen testen
        errorEl = fixture.debugElement.query(By.css('mat-error'));
        expect(errorEl.nativeElement.innerText.trim().length).toBeGreaterThan(0);
        expect(toggleComponent.formControl.valid).toBeFalsy();
      });
    });
  });

  describe('A11y', () => {
    let fixture: ComponentFixture<LuxToggleA11yComponent>;
    let testComponent: LuxToggleA11yComponent;

    beforeAll(() => {
      LuxA11yTestHelper.addA11yMatchers();
    });

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxToggleA11yComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (leer)', async () => {
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (disabled)', async () => {
      testComponent.disabled.set(true);
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (readonly)', async () => {
      testComponent.readonly.set(true);
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (required)', async () => {
      testComponent.required.set(true);
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });
  });
});

@Component({
  template: ` <lux-toggle luxLabel="Magst du Pommes?" [luxChecked]="true" [luxDisabled]="disabled()"></lux-toggle> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxToggleComponent]
})
class LuxDisabledAttributeComponent {
  disabled = signal(false);
}

@Component({
  template: ` <lux-toggle luxLabel="Eula gelesen?" (luxCheckedChange)="onCheckedChange($event)"></lux-toggle> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxToggleComponent]
})
class LuxCheckedChangeComponent {
  eula: boolean | null = null;

  onCheckedChange(value: boolean) {
    this.eula = value;
  }
}

@Component({
  template: ` <lux-toggle luxLabel="Eula gelesen?" [(luxChecked)]="eula"></lux-toggle> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxToggleComponent]
})
class LuxCheckedAttributeComponent {
  eula = signal<boolean | undefined>(undefined);
}

@Component({
  template: ` <lux-toggle [luxLabel]="label()" [luxChecked]="false"></lux-toggle> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxToggleComponent]
})
class LuxLabelAttributeComponent {
  label = signal('');
}

@Component({
  template: ` <lux-toggle luxLabel="Zustimmung erforderlich" [(checked)]="checked" [luxRequired]="true"></lux-toggle> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxToggleComponent]
})
class LuxCheckedRequiredAttributeComponent {
  checked = signal(true);
}

@Component({
  template: ` <lux-toggle [luxLabel]="label" [luxRequired]="true"></lux-toggle> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxToggleComponent]
})
class LuxRequiredAttributeComponent {
  label = '';
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <lux-toggle luxLabel="Eula gelesen?" luxControlBinding="eula" [luxRequired]="required"></lux-toggle>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxToggleComponent]
})
class LuxToggleInFormAttributeComponent {
  formGroup: FormGroup;
  required = false;

  constructor() {
    this.formGroup = new FormGroup<any>({
      eula: new FormControl<boolean>(true)
    });
  }
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <lux-toggle luxLabel="Eula gelesen?" luxControlBinding="eula"></lux-toggle>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxToggleComponent]
})
class LuxToggleRequiredInFormAttributeComponent {
  formGroup: FormGroup;

  constructor() {
    this.formGroup = new FormGroup<any>({
      eula: new FormControl<boolean | null>(null, Validators.requiredTrue)
    });
  }
}

@Component({
  template: ` <lux-toggle luxLabel="Eula gelesen?" [(luxChecked)]="eula" [luxControlValidators]="validators()"></lux-toggle> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxToggleComponent]
})
class LuxValidatorsComponent {
  eula?: boolean;
  validators = signal<ValidatorFnType>(undefined);
}

@Component({
  template: `
    <lux-toggle luxLabel="Eula gelesen?" [luxDisabled]="disabled()" [luxReadonly]="readonly()" [luxRequired]="required()"></lux-toggle>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxToggleComponent]
})
class LuxToggleA11yComponent {
  disabled = signal(false);
  readonly = signal(false);
  required = signal(false);
}
