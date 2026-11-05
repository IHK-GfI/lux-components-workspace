import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { of } from 'rxjs';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxLookupAutocompleteAcComponent } from '../../lux-lookup/lux-lookup-autocomplete-ac/lux-lookup-autocomplete-ac.component';
import { LuxLookupComboboxAcComponent } from '../../lux-lookup/lux-lookup-combobox-ac/lux-lookup-combobox-ac.component';
import { LuxFieldValues, LuxLookupParameters } from '../../lux-lookup/lux-lookup-model/lux-lookup-parameters';
import { LuxLookupHandlerService } from '../../lux-lookup/lux-lookup-service/lux-lookup-handler.service';
import { LuxLookupService } from '../../lux-lookup/lux-lookup-service/lux-lookup.service';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxAutocompleteAcComponent } from '../lux-autocomplete-ac/lux-autocomplete-ac.component';
import { LuxCheckboxAcComponent } from '../lux-checkbox-ac/lux-checkbox-ac.component';
import { LuxChipsAcComponent } from '../lux-chips-ac/lux-chips-ac.component';
import { LuxDatepickerAcComponent } from '../lux-datepicker-ac/lux-datepicker-ac.component';
import { LuxDatetimepickerAcComponent } from '../lux-datetimepicker-ac/lux-datetimepicker-ac.component';
import { LuxFileInputAcComponent } from '../lux-file/lux-file-input-ac/lux-file-input-ac.component';
import { LuxFileListComponent } from '../lux-file/lux-file-list/lux-file-list.component';
import { LuxFileUploadComponent } from '../lux-file/lux-file-upload/lux-file-upload.component';
import { LuxInputAcComponent } from '../lux-input-ac/lux-input-ac.component';
import { LuxRadioAcComponent } from '../lux-radio-ac/lux-radio-ac.component';
import { LuxSelectAcComponent } from '../lux-select-ac/lux-select-ac.component';
import { LuxSliderAcComponent } from '../lux-slider-ac/lux-slider-ac.component';
import { LuxTextareaAcComponent } from '../lux-textarea-ac/lux-textarea-ac.component';
import { LuxTimepickerComponent } from '../lux-timepicker/lux-timepicker.component';
import { LuxToggleAcComponent } from '../lux-toggle-ac/lux-toggle-ac.component';
import { LuxFormComponentBase } from './lux-form-component-base.class';

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
  beforeEach(waitForAsync(() => {
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
  }));

  function erstelle(komponente: Komponente, validatorFactory: (host: LuxRequiredTestComponent) => ValidatorFn) {
    const fixture = TestBed.createComponent(LuxRequiredTestComponent);
    const host = fixture.componentInstance;
    host.komponente = komponente;

    const control = host.form.get('feld')!;
    control.setValidators(validatorFactory(host));
    warte(fixture);

    const luxComponent: LuxFormComponentBase = fixture.debugElement.query(By.css('#feld')).componentInstance;

    return { fixture, host, control, luxComponent };
  }

  function aktualisiere(fixture: ComponentFixture<LuxRequiredTestComponent>, control: AbstractControl) {
    control.updateValueAndValidity();
    warte(fixture);
  }

  function warte(fixture: ComponentFixture<LuxRequiredTestComponent>) {
    LuxTestHelper.wait(fixture);
    flush();
    fixture.detectChanges();
  }

  komponenten.forEach(({ komponente, requiredValidator }) => {
    describe(komponente, () => {
      it('Sollte required in Validators.compose erkennen und beim Entfernen wieder freigeben', fakeAsync(() => {
        const composed = Validators.compose([requiredValidator, Validators.nullValidator])!;
        const { fixture, control, luxComponent } = erstelle(komponente, () => composed);

        expect(luxComponent.luxRequired).withContext('compose beim Start').toBeTrue();

        control.removeValidators(composed);
        aktualisiere(fixture, control);

        expect(luxComponent.luxRequired).withContext('nach removeValidators(compose)').toBeFalse();
        expect(control.hasError('required')).withContext('required-Fehler nach removeValidators(compose)').toBeFalse();

        control.addValidators(composed);
        aktualisiere(fixture, control);

        expect(luxComponent.luxRequired).withContext('compose nachträglich hinzugefügt').toBeTrue();

        discardPeriodicTasks();
      }));

      it('Sollte ein von Anfang an direkt gesetztes required per removeValidators() wieder freigeben', fakeAsync(() => {
        const { fixture, control, luxComponent } = erstelle(komponente, () => requiredValidator);

        expect(luxComponent.luxRequired).withContext('required beim Start').toBeTrue();

        control.removeValidators(requiredValidator);
        aktualisiere(fixture, control);

        expect(luxComponent.luxRequired).withContext('nach removeValidators(required)').toBeFalse();
        expect(control.hasError('required')).withContext('required-Fehler nach removeValidators(required)').toBeFalse();

        discardPeriodicTasks();
      }));

      it('Sollte einen bedingten required-Validator nach updateValueAndValidity() neu bewerten', fakeAsync(() => {
        const { fixture, host, control, luxComponent } = erstelle(
          komponente,
          (testHost) => (c: AbstractControl) => (testHost.bedingung ? requiredValidator(c) : null)
        );

        expect(luxComponent.luxRequired).withContext('Bedingung aus').toBeFalse();

        host.bedingung = true;
        aktualisiere(fixture, control);

        expect(luxComponent.luxRequired).withContext('Bedingung an').toBeTrue();

        host.bedingung = false;
        aktualisiere(fixture, control);

        expect(luxComponent.luxRequired).withContext('Bedingung wieder aus').toBeFalse();
        expect(control.hasError('required')).withContext('required-Fehler bei Bedingung aus').toBeFalse();

        discardPeriodicTasks();
      }));
    });
  });
});

@Component({
  template: `
    <form [formGroup]="form">
      @switch (komponente) {
        @case ('input') {
          <lux-input-ac luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-input-ac>
        }
        @case ('textarea') {
          <lux-textarea-ac luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-textarea-ac>
        }
        @case ('select') {
          <lux-select-ac
            luxLabel="Feld"
            [luxOptions]="options"
            luxOptionLabelProp="label"
            luxControlBinding="feld"
            id="feld"
          ></lux-select-ac>
        }
        @case ('radio') {
          <lux-radio-ac luxLabel="Feld" [luxOptions]="options" luxOptionLabelProp="label" luxControlBinding="feld" id="feld"></lux-radio-ac>
        }
        @case ('autocomplete') {
          <lux-autocomplete-ac luxLabel="Feld" [luxOptions]="options" luxControlBinding="feld" id="feld"></lux-autocomplete-ac>
        }
        @case ('chips') {
          <lux-chips-ac luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-chips-ac>
        }
        @case ('datepicker') {
          <lux-datepicker-ac luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-datepicker-ac>
        }
        @case ('datetimepicker') {
          <lux-datetimepicker-ac luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-datetimepicker-ac>
        }
        @case ('timepicker') {
          <lux-timepicker luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-timepicker>
        }
        @case ('slider') {
          <lux-slider-ac luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-slider-ac>
        }
        @case ('fileInput') {
          <lux-file-input-ac luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-file-input-ac>
        }
        @case ('fileUpload') {
          <lux-file-upload luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-file-upload>
        }
        @case ('fileList') {
          <lux-file-list luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-file-list>
        }
        @case ('lookupAutocomplete') {
          <lux-lookup-autocomplete-ac
            luxLabel="Feld"
            luxTableNo="5"
            luxLookupId="lookupAutocomplete"
            luxRenderProp="kurzText"
            [luxParameters]="lookupParameters"
            luxControlBinding="feld"
            id="feld"
          ></lux-lookup-autocomplete-ac>
        }
        @case ('lookupCombobox') {
          <lux-lookup-combobox-ac
            luxLabel="Feld"
            luxTableNo="5"
            luxLookupId="lookupCombobox"
            luxRenderProp="kurzText"
            [luxParameters]="lookupParameters"
            luxControlBinding="feld"
            id="feld"
          ></lux-lookup-combobox-ac>
        }
        @case ('checkbox') {
          <lux-checkbox-ac luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-checkbox-ac>
        }
        @case ('toggle') {
          <lux-toggle-ac luxLabel="Feld" luxControlBinding="feld" id="feld"></lux-toggle-ac>
        }
      }
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    LuxInputAcComponent,
    LuxTextareaAcComponent,
    LuxSelectAcComponent,
    LuxRadioAcComponent,
    LuxAutocompleteAcComponent,
    LuxChipsAcComponent,
    LuxDatepickerAcComponent,
    LuxDatetimepickerAcComponent,
    LuxTimepickerComponent,
    LuxSliderAcComponent,
    LuxFileInputAcComponent,
    LuxFileUploadComponent,
    LuxFileListComponent,
    LuxLookupAutocompleteAcComponent,
    LuxLookupComboboxAcComponent,
    LuxCheckboxAcComponent,
    LuxToggleAcComponent
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
