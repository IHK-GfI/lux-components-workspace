// noinspection DuplicatedCode

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxA11yTestHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { Observable, of } from 'rxjs';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxPickValueFnType } from '../lux-form-model/lux-form-selectable-base.class';
import { LuxRadioComponent } from './lux-radio.component';

describe('LuxRadioComponent', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        { provide: LuxMediaQueryObserverService, useClass: MockMediaObserver },
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

  describe('Attribut "luxErrorMessage"', () => {
    let fixture: ComponentFixture<MockLuxErrorMessageComponent>;
    let testComponent: MockLuxErrorMessageComponent;
    let radioComponent: LuxRadioComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(MockLuxErrorMessageComponent);
      testComponent = fixture.componentInstance;
      radioComponent = fixture.debugElement.query(By.directive(LuxRadioComponent)).componentInstance;
      await LuxTestHelper.wait(fixture);
    });

    it('luxErrorMessage nur bei Fehlern anzeigen', async () => {
      // Vorbedingungen testen
      let error = fixture.debugElement.query(By.css('mat-error'));
      expect(error).toBeNull();
      expect(testComponent.errorMessage()).toBeUndefined();

      // Änderungen durchführen
      const requiredMessage = 'XXX darf nicht leer sein.';
      testComponent.errorMessage.set(requiredMessage);
      LuxUtil.showValidationErrors(testComponent.form);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      error = fixture.debugElement.query(By.css('mat-error'));
      expect(error).not.toBeNull();
      expect(error.nativeElement.innerHTML.trim()).toEqual(requiredMessage);
      expect(testComponent.errorMessage()).toEqual(requiredMessage);

      // Änderungen durchführen
      testComponent.selected.set(testComponent.options[1]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      error = fixture.debugElement.query(By.directive(MatError));
      expect(error).toBeNull();

      await LuxTestHelper.wait(fixture);
    });
  });

  describe('Ohne das Attribut "luxErrorMessage"', () => {
    let fixture: ComponentFixture<MockWithoutLuxErrorMessageComponent>;
    let testComponent: MockWithoutLuxErrorMessageComponent;
    let radioComponent: LuxRadioComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(MockWithoutLuxErrorMessageComponent);
      testComponent = fixture.componentInstance;
      radioComponent = fixture.debugElement.query(By.directive(LuxRadioComponent)).componentInstance;
      await LuxTestHelper.wait(fixture);
    });

    it('luxErrorMessage nur bei Fehlern anzeigen', async () => {
      // Vorbedingungen testen
      let error = fixture.debugElement.query(By.css('mat-error'));
      expect(error).toBeNull();

      // Änderungen durchführen
      const requiredMessage = '* Pflichtfeld';
      LuxUtil.showValidationErrors(testComponent.form);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      error = fixture.debugElement.query(By.css('mat-error'));
      expect(error).not.toBeNull();
      expect(error.nativeElement.innerHTML.trim()).toEqual(requiredMessage);

      // Änderungen durchführen
      testComponent.selected.set(testComponent.options[1]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      error = fixture.debugElement.query(By.directive(MatError));
      expect(error).toBeNull();

      await LuxTestHelper.wait(fixture);
    });
  });

  describe('Außerhalb eines Formulars', () => {
    let fixture: ComponentFixture<MockRadioComponent>;
    let testComponent: MockRadioComponent;
    let radioComponent: LuxRadioComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(MockRadioComponent);
      testComponent = fixture.componentInstance;
      radioComponent = fixture.debugElement.query(By.directive(LuxRadioComponent)).componentInstance;
      await LuxTestHelper.wait(fixture);
    });

    it('Werte aus Options darstellen (Object-Array und String-Array)', async () => {
      // Vorbedingungen testen
      let radioLabels = fixture.debugElement.queryAll(By.css('.mdc-label'));
      expect(radioLabels[0].nativeElement.innerText.trim()).toEqual('Meine Aufgaben');
      expect(radioLabels[1].nativeElement.innerText.trim()).toEqual('Gruppenaufgaben');
      expect(radioLabels[2].nativeElement.innerText.trim()).toEqual('Zurückgestellte Aufgaben');

      // Änderungen durchführen
      testComponent.options.set(['Option 1', ' Option 2', ' Option 3'] as any);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      radioLabels = fixture.debugElement.queryAll(By.css('.mdc-label'));
      expect(radioLabels[0].nativeElement.innerText.trim()).toEqual('Option 1');
      expect(radioLabels[1].nativeElement.innerText.trim()).toEqual('Option 2');
      expect(radioLabels[2].nativeElement.innerText.trim()).toEqual('Option 3');

      await LuxTestHelper.wait(fixture);
    });

    it('Werte selektieren (Object-Array)', async () => {
      // Vorbedingungen testen
      const radioLabels = fixture.debugElement.queryAll(By.css('.mdc-label'));
      expect(radioLabels[0].nativeElement.innerText.trim()).toEqual('Meine Aufgaben');
      expect(radioLabels[1].nativeElement.innerText.trim()).toEqual('Gruppenaufgaben');
      expect(radioLabels[2].nativeElement.innerText.trim()).toEqual('Zurückgestellte Aufgaben');

      // Änderungen durchführen
      testComponent.selected.set(testComponent.options()[0]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      let checkedRadioLabel = fixture.debugElement.query(By.css('.mat-mdc-radio-checked .mdc-label'));
      expect(radioComponent.value()).toEqual(testComponent.options()[0]);
      expect(testComponent.selected()).toEqual(testComponent.options()[0]);
      expect(checkedRadioLabel.nativeElement.innerText.trim()).toEqual('Meine Aufgaben');

      // Änderungen durchführen
      testComponent.selected.set(testComponent.options()[2]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      checkedRadioLabel = fixture.debugElement.query(By.css('.mat-mdc-radio-checked .mdc-label'));
      expect(radioComponent.value()).toEqual(testComponent.options()[2]);
      expect(testComponent.selected()).toEqual(testComponent.options()[2]);
      expect(checkedRadioLabel.nativeElement.innerText.trim()).toEqual('Zurückgestellte Aufgaben');
    });

    it('Werte selektieren (String-Array)', async () => {
      testComponent.options.set(['Option 1', ' Option 2', ' Option 3'] as any);
      await LuxTestHelper.wait(fixture);
      // Vorbedingungen testen
      const radioLabels = fixture.debugElement.queryAll(By.css('.mdc-label'));
      expect(radioLabels[0].nativeElement.innerText.trim()).toEqual('Option 1');
      expect(radioLabels[1].nativeElement.innerText.trim()).toEqual('Option 2');
      expect(radioLabels[2].nativeElement.innerText.trim()).toEqual('Option 3');

      // Änderungen durchführen
      testComponent.selected.set(testComponent.options()[0]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      let checkedRadioLabel = fixture.debugElement.query(By.css('.mat-mdc-radio-checked .mdc-label'));
      expect(radioComponent.value()).toEqual(testComponent.options()[0]);
      expect(testComponent.selected()).toEqual(testComponent.options()[0]);
      expect(checkedRadioLabel.nativeElement.innerText.trim()).toEqual('Option 1');

      // Änderungen durchführen
      testComponent.selected.set(testComponent.options()[2]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      checkedRadioLabel = fixture.debugElement.query(By.css('.mat-mdc-radio-checked .mdc-label'));
      expect(radioComponent.value()).toEqual(testComponent.options()[2]);
      expect(testComponent.selected()).toEqual(testComponent.options()[2]);
      expect(checkedRadioLabel.nativeElement.innerText.trim()).toEqual('Option 3');
    });

    it('Sollte null, undefined und "" fehlerfrei als leeren String darstellen und die Werte emitten', async () => {
      // Vorbedingungen testen
      testComponent.options.set([null, undefined, '', 'A'] as any);
      await LuxTestHelper.wait(fixture);

      const optionLabels = fixture.debugElement.queryAll(By.css('.mdc-label'));
      const radioButtons = fixture.debugElement.queryAll(By.css('mat-radio-button input'));

      expect(optionLabels.length).toBe(testComponent.options().length);
      expect(optionLabels[0].nativeElement.innerText.trim()).toEqual('');
      expect(optionLabels[1].nativeElement.innerText.trim()).toEqual('');
      expect(optionLabels[2].nativeElement.innerText.trim()).toEqual('');
      expect(optionLabels[3].nativeElement.innerText.trim()).toEqual('A');

      // Änderungen durchführen
      radioButtons[0].nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(testComponent.selected()).toBeNull();

      // Änderungen durchführen
      radioButtons[1].nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(testComponent.selected()).toBeUndefined();

      // Änderungen durchführen
      radioButtons[2].nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(testComponent.selected()).toBe('');

      // Änderungen durchführen
      radioButtons[3].nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(testComponent.selected()).toBe('A');
    });

    it('Werte selektieren (mit PickValue Funktion)', async () => {
      // Vorbedingungen testen
      testComponent.pickValueFn.set((o1: Option) => (o1 ? o1.value : ''));
      await LuxTestHelper.wait(fixture);

      const radioLabels = fixture.debugElement.queryAll(By.css('.mdc-label'));
      expect(radioLabels[0].nativeElement.innerText.trim()).toEqual('Meine Aufgaben');
      expect(radioLabels[1].nativeElement.innerText.trim()).toEqual('Gruppenaufgaben');
      expect(radioLabels[2].nativeElement.innerText.trim()).toEqual('Zurückgestellte Aufgaben');

      // Änderungen durchführen
      testComponent.selected.set(testComponent.options()[0]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      let checkedRadioLabel = fixture.debugElement.query(By.css('.mat-mdc-radio-checked .mdc-label'));
      expect(radioComponent.value()).toEqual(testComponent.options()[0].value);
      expect(testComponent.selected()).toEqual(testComponent.options()[0].value);
      expect(checkedRadioLabel.nativeElement.innerText.trim()).toEqual('Meine Aufgaben');

      // Änderungen durchführen
      testComponent.selected.set(testComponent.options()[2]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      checkedRadioLabel = fixture.debugElement.query(By.css('.mat-mdc-radio-checked .mdc-label'));
      expect(radioComponent.value()).toEqual(testComponent.options()[2].value);
      expect(testComponent.selected()).toEqual(testComponent.options()[2].value);
      expect(checkedRadioLabel.nativeElement.innerText.trim()).toEqual('Zurückgestellte Aufgaben');

      await LuxTestHelper.wait(fixture);
    });

    it('Kein initiales Change-Event ausgeben', async () => {
      // Vorbedingungen testen.
      // Die Component muss neu initialisiert werden.
      fixture = TestBed.createComponent(MockRadioComponent);
      testComponent = fixture.componentInstance;
      radioComponent = fixture.debugElement.query(By.directive(LuxRadioComponent)).componentInstance;
      const changeEventSpy = vi.spyOn(radioComponent.luxSelectedChange, 'emit').mockReturnValue(undefined);

      await LuxTestHelper.wait(fixture);

      expect(changeEventSpy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      testComponent.selected.set(testComponent.options()[0]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(changeEventSpy).toHaveBeenCalledTimes(1);
    });

    it('Label anzeigen', async () => {
      // Vorbedingungen testen
      let luxLabel = fixture.debugElement.query(By.css('.lux-label-authentic'));
      expect(luxLabel.nativeElement.innerText.trim()).toEqual('');

      // Änderungen durchführen
      testComponent.label.set('Demolabel');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      luxLabel = fixture.debugElement.query(By.css('.lux-label-authentic'));
      expect(luxLabel.nativeElement.innerText.trim()).toEqual('Demolabel');
    });

    it('Deaktivieren', async () => {
      // Vorbedingungen testen
      let disabledRadioButtons = fixture.debugElement.queryAll(By.css('.mdc-radio--disabled'));
      expect(disabledRadioButtons.length).toBe(0);

      // Änderungen durchführen
      testComponent.disabled.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      disabledRadioButtons = fixture.debugElement.queryAll(By.css('.mdc-radio--disabled'));
      expect(disabledRadioButtons.length).toBe(4);
    });

    it('Readonly', async () => {
      // Vorbedingungen testen
      let disabledRadioButtons = fixture.debugElement.queryAll(By.css('.mdc-radio--disabled'));
      let readonlyRadioGroup = fixture.debugElement.query(By.css('.lux-readonly-authentic'));

      expect(disabledRadioButtons.length).toBe(0);
      expect(readonlyRadioGroup).toBeFalsy();

      // Änderungen durchführen
      testComponent.readonly.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      disabledRadioButtons = fixture.debugElement.queryAll(By.css('.mdc-radio--disabled'));
      readonlyRadioGroup = fixture.debugElement.query(By.css('.lux-readonly-authentic'));

      expect(disabledRadioButtons.length).toBe(0);
      expect(readonlyRadioGroup).toBeDefined();
    });

    it('Sollte Werte anhand der Compare-Funktion vergleichen', async () => {
      // Vorbedingungen testen
      testComponent.compareFn.set((o1, o2) => o1.value === o2.value);
      await LuxTestHelper.wait(fixture);

      expect(radioComponent.value()).toBeFalsy();

      // Änderungen durchführen
      const copy = JSON.parse(JSON.stringify(testComponent.options()[2]));
      testComponent.selected.set(copy);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(radioComponent.value()).toBe(copy);

      await LuxTestHelper.wait(fixture);
    });
  });

  describe('Mit Template für Darstellung', () => {
    let fixture: ComponentFixture<MockRadioWithTemplateComponent>;
    let testComponent: MockRadioWithTemplateComponent;
    let radioComponent: LuxRadioComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(MockRadioWithTemplateComponent);
      testComponent = fixture.componentInstance;
      radioComponent = fixture.debugElement.query(By.directive(LuxRadioComponent)).componentInstance;
      await LuxTestHelper.wait(fixture);
    });

    it('Sollte das Template korrekt rendern', async () => {
      // Vorbedingungen testen
      let radioLabels = fixture.debugElement.queryAll(By.css('.mdc-label'));
      expect(radioLabels[0].nativeElement.innerText.trim()).toEqual('Meine Aufgaben');
      expect(radioLabels[1].nativeElement.innerText.trim()).toEqual('Gruppenaufgaben');
      expect(radioLabels[2].nativeElement.innerText.trim()).toEqual('Zurückgestellte Aufgaben');

      // Änderungen durchführen
      testComponent.options.set(['Option 1', ' Option 2', ' Option 3'] as any);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      radioLabels = fixture.debugElement.queryAll(By.css('.mdc-label'));
      expect(radioLabels[0].nativeElement.innerText.trim()).toEqual('Option 1');
      expect(radioLabels[1].nativeElement.innerText.trim()).toEqual('Option 2');
      expect(radioLabels[2].nativeElement.innerText.trim()).toEqual('Option 3');
    });
  });

  describe('Innerhalb eines Formulars', () => {
    let fixture: ComponentFixture<MockRadioFormComponent>;
    let testComponent: MockRadioFormComponent;
    let radioComponent: LuxRadioComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(MockRadioFormComponent);
      testComponent = fixture.componentInstance;
      radioComponent = fixture.debugElement.query(By.directive(LuxRadioComponent)).componentInstance;
      await LuxTestHelper.wait(fixture);
    });

    it('Sollte die Werte korrekt ins Formular übertragen', async () => {
      // Vorbedingungen testen
      const radioLabels = fixture.debugElement.queryAll(By.css('.mdc-label'));
      expect(radioLabels[0].nativeElement.innerText.trim()).toEqual('Meine Aufgaben');
      expect(radioLabels[1].nativeElement.innerText.trim()).toEqual('Gruppenaufgaben');
      expect(radioLabels[2].nativeElement.innerText.trim()).toEqual('Zurückgestellte Aufgaben');
      expect(testComponent.form.get('radio')!.value).toBeFalsy();

      // Änderungen durchführen
      testComponent.form.get('radio')!.setValue(testComponent.options()[0]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      const checkedRadioLabel = fixture.debugElement.query(By.css('.mat-mdc-radio-checked .mdc-label'));
      expect(radioComponent.value()).toEqual(testComponent.options()[0]);
      expect(testComponent.selected).toEqual(testComponent.options()[0]);
      expect(checkedRadioLabel.nativeElement.innerText.trim()).toEqual('Meine Aufgaben');
      expect(testComponent.form.get('radio')!.value).toEqual(testComponent.options()[0]);
    });

    it('Sollte eine Option deaktivieren können', async () => {
      // Vorbedingungen testen
      const radioLabels = fixture.debugElement.queryAll(By.css('.mdc-label'));
      expect(radioLabels[0].nativeElement.innerText.trim()).toEqual('Meine Aufgaben');
      expect(radioLabels[1].nativeElement.innerText.trim()).toEqual('Gruppenaufgaben');
      expect(radioLabels[2].nativeElement.innerText.trim()).toEqual('Zurückgestellte Aufgaben');
      expect(testComponent.form.get('radio')!.value).toBeNull();

      // Änderungen durchführen
      testComponent.options.set(testComponent.options().map((option, index) => (index === 1 ? { ...option, disabled: true } : option)));
      await LuxTestHelper.wait(fixture);

      const radioButtons = fixture.debugElement.queryAll(By.css('mat-radio-button input'));
      radioButtons[1].nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(testComponent.form.get('radio')!.value).toBeNull();
    });

    it('Required', async () => {
      // Vorbedingungen testen
      let errorMessage = fixture.debugElement.query(By.css('mat-error'));
      expect(errorMessage).toBeNull();

      // Änderungen durchführen
      testComponent.form.get('radio')!.setValidators(Validators.required);
      await LuxTestHelper.wait(fixture);
      await LuxTestHelper.wait(fixture);
      radioComponent.formControl.markAsTouched();
      radioComponent.formControl.updateValueAndValidity();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      errorMessage = fixture.debugElement.query(By.css('mat-error'));
      expect(errorMessage.nativeElement.innerText.trim()).toEqual('* Pflichtfeld');
    });
  });

  describe('A11y', () => {
    let fixture: ComponentFixture<LuxRadioA11yComponent>;
    let testComponent: LuxRadioA11yComponent;

    beforeAll(() => {
      LuxA11yTestHelper.addA11yMatchers();
    });

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxRadioA11yComponent);
      await LuxTestHelper.wait(fixture);
      testComponent = fixture.componentInstance;
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (leer)', async () => {
      await LuxTestHelper.wait(fixture);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (disabled)', async () => {
      testComponent.disabled.set(true);
      await LuxTestHelper.wait(fixture);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (readonly)', async () => {
      testComponent.readonly.set(true);
      await LuxTestHelper.wait(fixture);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (required)', async () => {
      testComponent.required.set(true);
      await LuxTestHelper.wait(fixture);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });
  });
});

declare interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  template: `
    <lux-radio
      [luxOptions]="options()"
      [luxDisabled]="disabled()"
      luxOptionLabelProp="label"
      [(luxSelected)]="selected"
      [luxPickValue]="pickValueFn()"
      [luxCompareWith]="compareFn()"
      [luxReadonly]="readonly()"
      [luxLabel]="label()"
      [luxRequired]="required"
      (luxSelectedChange)="radioSelected($event)"
    ></lux-radio>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxRadioComponent]
})
class MockRadioComponent {
  label = signal<string>('');
  options = signal<Option[]>([
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ]);

  selected = signal<any>(undefined);
  disabled = signal<boolean>(false);
  readonly = signal(false);
  required = false;
  pickValueFn = signal<LuxPickValueFnType<Option, string> | undefined>(undefined);
  compareFn = signal((o1: Option, o2: Option) => o1 === o2);

  constructor() {}

  radioSelected(selected: Option) {
    this.selected.set(selected);
  }
}

@Component({
  template: `
    <lux-radio [luxOptions]="options()">
      <ng-template let-option>
        {{ option.label ? option.label : option }}
      </ng-template>
    </lux-radio>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxRadioComponent]
})
class MockRadioWithTemplateComponent {
  options = signal([
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ]);

  constructor() {}
}

@Component({
  template: `
    <form [formGroup]="form">
      <lux-radio
        [luxOptions]="options()"
        [luxDisabled]="disabled"
        luxOptionLabelProp="label"
        (luxSelectedChange)="radioSelected($event)"
        luxControlBinding="radio"
      ></lux-radio>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxRadioComponent]
})
class MockRadioFormComponent {
  options = signal<
    {
      label: string;
      value: string;
      disabled?: boolean;
    }[]
  >([
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ]);

  selected: any;
  disabled = false;

  form: FormGroup;

  constructor() {
    this.form = new FormGroup<any>({
      radio: new FormControl(null)
    });
  }

  radioSelected(selected: Option) {
    this.selected = selected;
  }
}

class MockMediaObserver {
  static XS = false;

  getMediaQueryChangedAsObservable(): Observable<any> {
    return of('gt');
  }

  isXS() {
    return MockMediaObserver.XS;
  }
}

@Component({
  selector: 'lux-mock-error',
  template: `
    <form [formGroup]="form">
      <lux-radio [luxOptions]="options" luxOptionLabelProp="label" [luxSelected]="selected()" luxControlBinding="radio"></lux-radio>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxRadioComponent]
})
class MockWithoutLuxErrorMessageComponent {
  options = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];

  form: FormGroup;

  selected = signal<any>(undefined);

  constructor() {
    this.form = new FormGroup<any>({
      radio: new FormControl('', { validators: Validators.required, nonNullable: true })
    });
  }
}

@Component({
  selector: 'lux-mock-error',
  template: `
    <form [formGroup]="form">
      <lux-radio
        [luxOptions]="options"
        luxOptionLabelProp="label"
        [luxSelected]="selected()"
        luxControlBinding="radio"
        [luxErrorMessage]="errorMessage()"
      ></lux-radio>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxRadioComponent]
})
class MockLuxErrorMessageComponent {
  options = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];

  form: FormGroup;

  errorMessage = signal<string | undefined>(undefined);

  selected = signal<any>(undefined);

  constructor() {
    this.form = new FormGroup<any>({
      radio: new FormControl('', { validators: Validators.required, nonNullable: true })
    });
  }
}

@Component({
  template: `
    <lux-radio
      luxLabel="Optionen"
      luxOptionLabelProp="label"
      [luxOptions]="options"
      [luxDisabled]="disabled()"
      [luxReadonly]="readonly()"
      [luxRequired]="required()"
    ></lux-radio>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxRadioComponent]
})
class LuxRadioA11yComponent {
  options = [{ label: 'Option A', value: 'A' }];
  disabled = signal(false);
  readonly = signal(false);
  required = signal(false);
}
