import { describe, it, beforeEach, expect } from 'vitest';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { of } from 'rxjs';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxLookupAutocompleteComponent } from '../../lux-lookup/lux-lookup-autocomplete/lux-lookup-autocomplete.component';
import { LuxLookupComboboxComponent } from '../../lux-lookup/lux-lookup-combobox/lux-lookup-combobox.component';
import { LuxFieldValues, LuxLookupParameters } from '../../lux-lookup/lux-lookup-model/lux-lookup-parameters';
import { LuxLookupHandlerService } from '../../lux-lookup/lux-lookup-service/lux-lookup-handler.service';
import { LuxLookupService } from '../../lux-lookup/lux-lookup-service/lux-lookup.service';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxAutocompleteComponent } from '../lux-autocomplete/lux-autocomplete.component';
import { LuxCheckboxComponent } from '../lux-checkbox/lux-checkbox.component';
import { LuxChipsComponent } from '../lux-chips/lux-chips.component';
import { LuxDatepickerComponent } from '../lux-datepicker/lux-datepicker.component';
import { LuxDatetimepickerComponent } from '../lux-datetimepicker/lux-datetimepicker.component';
import { LuxFileInputComponent } from '../lux-file/lux-file-input/lux-file-input.component';
import { LuxFileListComponent } from '../lux-file/lux-file-list/lux-file-list.component';
import { LuxFileUploadComponent } from '../lux-file/lux-file-upload/lux-file-upload.component';
import { LuxInputComponent } from '../lux-input/lux-input.component';
import { LuxRadioComponent } from '../lux-radio/lux-radio.component';
import { LuxSelectComponent } from '../lux-select/lux-select.component';
import { LuxSliderComponent } from '../lux-slider/lux-slider.component';
import { LuxTextareaComponent } from '../lux-textarea/lux-textarea.component';
import { LuxTimepickerComponent } from '../lux-timepicker/lux-timepicker.component';
import { LuxToggleComponent } from '../lux-toggle/lux-toggle.component';

type Komponente =
  | 'input'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'autocomplete'
  | 'chips'
  | 'datepicker'
  | 'datetimepicker'
  | 'timepicker'
  | 'slider'
  | 'fileInput'
  | 'fileUpload'
  | 'fileList'
  | 'lookupAutocomplete'
  | 'lookupCombobox'
  | 'checkbox'
  | 'toggle';

// Checkbox und Toggle verwenden Validators.requiredTrue (siehe LuxFormCheckableBaseClass).
const komponenten: { komponente: Komponente; requiredValidator: ValidatorFn }[] = [
  { komponente: 'input', requiredValidator: Validators.required },
  { komponente: 'textarea', requiredValidator: Validators.required },
  { komponente: 'select', requiredValidator: Validators.required },
  { komponente: 'radio', requiredValidator: Validators.required },
  { komponente: 'autocomplete', requiredValidator: Validators.required },
  { komponente: 'chips', requiredValidator: Validators.required },
  { komponente: 'datepicker', requiredValidator: Validators.required },
  { komponente: 'datetimepicker', requiredValidator: Validators.required },
  { komponente: 'timepicker', requiredValidator: Validators.required },
  { komponente: 'slider', requiredValidator: Validators.required },
  { komponente: 'fileInput', requiredValidator: Validators.required },
  { komponente: 'fileUpload', requiredValidator: Validators.required },
  { komponente: 'fileList', requiredValidator: Validators.required },
  { komponente: 'lookupAutocomplete', requiredValidator: Validators.required },
  { komponente: 'lookupCombobox', requiredValidator: Validators.required },
  { komponente: 'checkbox', requiredValidator: Validators.requiredTrue },
  { komponente: 'toggle', requiredValidator: Validators.requiredTrue }
];

// Erkennung von required in Reactive Forms für alle Formularkomponenten (Issue #318).
// Geprüft wird vor allem, dass ein einmal erkanntes required wieder freigegeben wird. Sonst hielte die
// [required]-Bindung der Komponente das Control dauerhaft required und damit ungültig (Issue #240).
describe('LuxFormComponentBase - required-Erkennung in Reactive Forms', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        LuxLookupHandlerService,
        { provide: LuxLookupService, useValue: { getLookupTable: () => of([]) } },
        provideNoopAnimations(),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  });

  async function erstelle(komponente: Komponente, validatorFactory: (host: LuxRequiredTestComponent) => ValidatorFn) {
    const fixture = TestBed.createComponent(LuxRequiredTestComponent);
    const host = fixture.componentInstance;
    host.komponente = komponente;

    const control = host.form.get('feld')!;
    control.setValidators(validatorFactory(host));
    await warte(fixture);

    const luxComponent: { luxRequired: Signal<boolean> } = fixture.debugElement.query(By.css('#feld')).componentInstance;

    return { fixture, host, control, luxComponent };
  }

  async function aktualisiere(fixture: ComponentFixture<LuxRequiredTestComponent>, control: AbstractControl) {
    control.updateValueAndValidity();
    await warte(fixture);
  }

  async function warte(fixture: ComponentFixture<LuxRequiredTestComponent>) {
    await LuxTestHelper.wait(fixture);
    await LuxTestHelper.wait(fixture);
    fixture.detectChanges();
  }

  komponenten.forEach(({ komponente, requiredValidator }) => {
    describe(komponente, () => {
      it('Sollte required in Validators.compose erkennen und beim Entfernen wieder freigeben', async () => {
        const composed = Validators.compose([requiredValidator, Validators.nullValidator])!;
        const { fixture, control, luxComponent } = await erstelle(komponente, () => composed);

        expect(luxComponent.luxRequired(), 'compose beim Start').toBe(true);

        control.removeValidators(composed);
        await aktualisiere(fixture, control);

        expect(luxComponent.luxRequired(), 'nach removeValidators(compose)').toBe(false);
        expect(control.hasError('required'), 'required-Fehler nach removeValidators(compose)').toBe(false);

        control.addValidators(composed);
        await aktualisiere(fixture, control);

        expect(luxComponent.luxRequired(), 'compose nachträglich hinzugefügt').toBe(true);
      });

      it('Sollte ein von Anfang an direkt gesetztes required per removeValidators() wieder freigeben', async () => {
        const { fixture, control, luxComponent } = await erstelle(komponente, () => requiredValidator);

        expect(luxComponent.luxRequired(), 'required beim Start').toBe(true);

        control.removeValidators(requiredValidator);
        await aktualisiere(fixture, control);

        expect(luxComponent.luxRequired(), 'nach removeValidators(required)').toBe(false);
        expect(control.hasError('required'), 'required-Fehler nach removeValidators(required)').toBe(false);
      });

      it('Sollte einen bedingten required-Validator nach updateValueAndValidity() neu bewerten', async () => {
        const { fixture, host, control, luxComponent } = await erstelle(
          komponente,
          (testHost) => (c: AbstractControl) => (testHost.bedingung ? requiredValidator(c) : null)
        );

        expect(luxComponent.luxRequired(), 'Bedingung aus').toBe(false);

        host.bedingung = true;
        await aktualisiere(fixture, control);

        expect(luxComponent.luxRequired(), 'Bedingung an').toBe(true);

        host.bedingung = false;
        await aktualisiere(fixture, control);

        expect(luxComponent.luxRequired(), 'Bedingung wieder aus').toBe(false);
        expect(control.hasError('required'), 'required-Fehler bei Bedingung aus').toBe(false);
      });
    });
  });
});

@Component({
  template: `
    <form [formGroup]="form">
      @switch (komponente) {
        @case ('input') {
          <lux-input luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-input>
        }
        @case ('textarea') {
          <lux-textarea luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-textarea>
        }
        @case ('select') {
          <lux-select luxLabel="Feld" [luxOptions]="options" luxOptionLabelProp="label" luxControlBinding="feld" id="feld"></lux-select>
        }
        @case ('radio') {
          <lux-radio luxLabel="Feld" [luxOptions]="options" luxOptionLabelProp="label" luxControlBinding="feld" id="feld"></lux-radio>
        }
        @case ('autocomplete') {
          <lux-autocomplete luxLabel="Feld" [luxOptions]="options" luxControlBinding="feld" id="feld"></lux-autocomplete>
        }
        @case ('chips') {
          <lux-chips luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-chips>
        }
        @case ('datepicker') {
          <lux-datepicker luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-datepicker>
        }
        @case ('datetimepicker') {
          <lux-datetimepicker luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-datetimepicker>
        }
        @case ('timepicker') {
          <lux-timepicker luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-timepicker>
        }
        @case ('slider') {
          <lux-slider luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-slider>
        }
        @case ('fileInput') {
          <lux-file-input luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-file-input>
        }
        @case ('fileUpload') {
          <lux-file-upload luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-file-upload>
        }
        @case ('fileList') {
          <lux-file-list luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-file-list>
        }
        @case ('lookupAutocomplete') {
          <lux-lookup-autocomplete
            luxLabel="Feld"
            luxTableNo="5"
            luxLookupId="lookupAutocomplete"
            luxRenderProp="kurzText"
            [luxParameters]="lookupParameters"
            luxControlBinding="feld"
            id="feld"
          ></lux-lookup-autocomplete>
        }
        @case ('lookupCombobox') {
          <lux-lookup-combobox
            luxLabel="Feld"
            luxTableNo="5"
            luxLookupId="lookupCombobox"
            luxRenderProp="kurzText"
            [luxParameters]="lookupParameters"
            luxControlBinding="feld"
            id="feld"
          ></lux-lookup-combobox>
        }
        @case ('checkbox') {
          <lux-checkbox luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-checkbox>
        }
        @case ('toggle') {
          <lux-toggle luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-toggle>
        }
      }
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    LuxInputComponent,
    LuxTextareaComponent,
    LuxSelectComponent,
    LuxRadioComponent,
    LuxAutocompleteComponent,
    LuxChipsComponent,
    LuxDatepickerComponent,
    LuxDatetimepickerComponent,
    LuxTimepickerComponent,
    LuxSliderComponent,
    LuxFileInputComponent,
    LuxFileUploadComponent,
    LuxFileListComponent,
    LuxLookupAutocompleteComponent,
    LuxLookupComboboxComponent,
    LuxCheckboxComponent,
    LuxToggleComponent
  ]
})
class LuxRequiredTestComponent {
  komponente: Komponente = 'input';
  bedingung = false;

  options = [
    { label: 'Option #1', value: '#1' },
    { label: 'Option #2', value: '#2' }
  ];

  lookupParameters = new LuxLookupParameters({ knr: 101, fields: [LuxFieldValues.kurz] });

  form = new FormGroup({
    feld: new FormControl<any>(null)
  });
}
