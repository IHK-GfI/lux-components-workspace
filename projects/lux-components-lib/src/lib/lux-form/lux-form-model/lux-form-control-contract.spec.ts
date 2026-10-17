import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField, form, maxLength, required } from '@angular/forms/signals';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxFormCheckboxControlBase } from './lux-form-checkbox-control-base.class';
import { LuxFormValueControlBase } from './lux-form-value-control-base.class';

/**
 * Sichert den Kern der Signal-Forms-Umstellung ab: Dass eine LUX-FormComponent von der
 * [formField]-Direktive tatsächlich als Custom Control erkannt und verdrahtet wird.
 *
 * Die Vertrags-Property-Namen (value/checked, disabled, required, errors, touched, touch) sind
 * dabei bindend - Angular schlägt sie über den öffentlichen Input-Namen nach. Bricht einer dieser
 * Tests, wurde vermutlich eine Vertrags-Property umbenannt oder mit einem alias versehen.
 */
@Component({
  selector: 'lux-contract-test-input',
  template: `<input [value]="nativeValue()" [disabled]="isDisabled()" (input)="onInput($event)" (blur)="onBlur()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class ContractTestInputComponent extends LuxFormValueControlBase<string> {
  // Bewusst als computed und nicht als "value() ?? ''" im Template: Der deklarierte Typ ist string,
  // die extended diagnostic NG8102 würde das ?? im Template deshalb zu Recht anmeckern.
  readonly nativeValue = computed(() => this.value() ?? '');

  onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }
}

@Component({
  selector: 'lux-contract-test-checkbox',
  template: `<input type="checkbox" [checked]="checked()" [disabled]="isDisabled()" (change)="onChange($event)" (blur)="onBlur()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class ContractTestCheckboxComponent extends LuxFormCheckboxControlBase {
  onChange(event: Event) {
    this.checked.set((event.target as HTMLInputElement).checked);
  }
}

@Component({
  selector: 'lux-contract-test-host',
  template: `
    <lux-contract-test-input [formField]="testForm.text" [luxErrorMessage]="errorMessageOverride()" />
    <lux-contract-test-checkbox [formField]="testForm.flag" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, ContractTestInputComponent, ContractTestCheckboxComponent]
})
class ContractTestHostComponent {
  readonly errorMessageOverride = input<string | undefined>(undefined);

  readonly model = signal({ text: '', flag: false });
  readonly testForm = form(this.model, (path) => {
    required(path.text, { message: 'Pflichtfeld' });
    maxLength(path.text, 3);
  });
}

/** Freistehende Nutzung - dieselbe Komponente, ohne jedes Formular. */
@Component({
  selector: 'lux-contract-standalone-host',
  template: `<lux-contract-test-input [(value)]="text" [disabled]="disabled()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContractTestInputComponent]
})
class ContractStandaloneHostComponent {
  readonly text = signal('start');
  readonly disabled = signal(false);
}

describe('Signal-Forms-Vertrag der LUX-FormControl-Basisklassen', () => {
  describe('im Signal-Form ([formField])', () => {
    let fixture: ComponentFixture<ContractTestHostComponent>;
    let host: ContractTestHostComponent;

    const inputComponent = (): ContractTestInputComponent =>
      fixture.debugElement.children[0].componentInstance as ContractTestInputComponent;
    const checkboxComponent = (): ContractTestCheckboxComponent =>
      fixture.debugElement.children[1].componentInstance as ContractTestCheckboxComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ContractTestHostComponent],
        providers: [provideLuxTranslocoTesting(), LuxConsoleService]
      }).compileComponents();
      fixture = TestBed.createComponent(ContractTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('sollte value als Custom Control erkennen und den Feldwert hineinschreiben', () => {
      host.model.set({ text: 'abc', flag: false });
      fixture.detectChanges();

      expect(inputComponent().value()).toBe('abc');
    });

    it('sollte eine Änderung am value-Model zurück in das Modell schreiben', () => {
      inputComponent().value.set('xy');
      fixture.detectChanges();

      expect(host.model().text).toBe('xy');
      expect(host.testForm.text().value()).toBe('xy');
    });

    it('sollte checked als Checkbox-Vertrag erkennen (beide Richtungen)', () => {
      host.model.set({ text: '', flag: true });
      fixture.detectChanges();
      expect(checkboxComponent().checked()).toBe(true);

      checkboxComponent().checked.set(false);
      fixture.detectChanges();
      expect(host.model().flag).toBe(false);
    });

    it('sollte die Validierungsfehler des Feldes in den errors-Input schreiben', () => {
      // Leerer Text => required schlägt an.
      expect(
        inputComponent()
          .resolvedErrors()
          .map((error) => error.kind)
      ).toContain('required');

      host.model.set({ text: 'zu lang', flag: false });
      fixture.detectChanges();

      expect(
        inputComponent()
          .resolvedErrors()
          .map((error) => error.kind)
      ).toContain('maxLength');
    });

    it('sollte die im Schema hinterlegte Fehlermeldung als errorMessage übernehmen', () => {
      expect(inputComponent().errorMessage()).toBe('Pflichtfeld');
    });

    it('sollte ohne Schema-Meldung auf den Transloco-Standardtext zurückfallen', () => {
      // maxLength ist im Schema ohne message deklariert.
      host.model.set({ text: 'zu lang', flag: false });
      fixture.detectChanges();

      expect(inputComponent().errorMessage()).toBe('Die Maximallänge ist 3');
    });

    it('sollte luxErrorMessage über die Schema-Meldung stellen', () => {
      fixture.componentRef.setInput('errorMessageOverride', 'Von aussen gesetzt');
      fixture.detectChanges();

      expect(inputComponent().errorMessage()).toBe('Von aussen gesetzt');
    });

    it('sollte required aus dem Schema in den required-Input schreiben', () => {
      expect(inputComponent().isRequired()).toBe(true);
    });

    it('sollte über den touch-Output das Feld als berührt markieren', () => {
      expect(host.testForm.text().touched()).toBe(false);

      inputComponent().onBlur();
      fixture.detectChanges();

      expect(host.testForm.text().touched()).toBe(true);
      expect(inputComponent().isTouched()).toBe(true);
    });

    it('sollte den Fehler erst nach dem Berühren anzeigen', () => {
      expect(inputComponent().showError()).toBe(false);

      inputComponent().onBlur();
      fixture.detectChanges();

      expect(inputComponent().showError()).toBe(true);
    });
  });

  describe('freistehend ([(value)])', () => {
    let fixture: ComponentFixture<ContractStandaloneHostComponent>;
    let host: ContractStandaloneHostComponent;

    const inputComponent = (): ContractTestInputComponent =>
      fixture.debugElement.children[0].componentInstance as ContractTestInputComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ContractStandaloneHostComponent],
        providers: [provideLuxTranslocoTesting(), LuxConsoleService]
      }).compileComponents();
      fixture = TestBed.createComponent(ContractStandaloneHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('sollte den gebundenen Wert übernehmen', () => {
      expect(inputComponent().value()).toBe('start');
    });

    it('sollte eine Änderung ohne jedes Formular nach außen melden', () => {
      inputComponent().value.set('geaendert');
      fixture.detectChanges();

      expect(host.text()).toBe('geaendert');
    });

    it('sollte ohne Formular keine Fehler und keinen Pflichtfeld-Zustand haben', () => {
      expect(inputComponent().resolvedErrors()).toEqual([]);
      expect(inputComponent().errorMessage()).toBeUndefined();
      expect(inputComponent().isRequired()).toBe(false);
    });

    it('sollte disabled als einfachen Input unterstützen', () => {
      expect(inputComponent().isDisabled()).toBe(false);

      host.disabled.set(true);
      fixture.detectChanges();

      expect(inputComponent().isDisabled()).toBe(true);
    });

    it('sollte touched ohne Formular selbst verwalten', () => {
      expect(inputComponent().isTouched()).toBe(false);

      inputComponent().onBlur();
      fixture.detectChanges();

      expect(inputComponent().isTouched()).toBe(true);
    });
  });
});
