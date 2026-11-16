import { ChangeDetectionStrategy, Component, Signal, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { disabled, form, FormField, readonly, required, validate } from '@angular/forms/signals';
import {
  LuxAutofocusDirective,
  LuxDatepickerComponent,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxTimepickerComponent,
  LuxToggleComponent,
  LuxUtil,
  luxDateTimeValue,
  luxDateValue,
  luxTimeValue
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { emptyErrorCallback, exampleErrorCallback, logResult } from '../../example-base/example-base-util/example-base-helper';
import { ExampleFormDisableComponent } from '../../example-base/example-form-disable/example-form-disable.component';
import { ExampleFormValueComponent } from '../../example-base/example-form-value/example-form-value.component';
import { ExampleSignalFormValueComponent } from '../../example-base/example-signal-form-value/example-signal-form-value.component';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';

interface TimepickerDummyForm {
  timepickerExample: FormControl<string | null>;
  combinedIsoExample: FormControl<string | null>;
}

@Component({
  selector: 'lux-timepicker-example',
  templateUrl: './timepicker-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxToggleComponent,
    LuxInputComponent,
    LuxFormHintComponent,
    LuxDatepickerComponent,
    LuxTimepickerComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleValueComponent,
    ReactiveFormsModule,
    ExampleFormValueComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleFormDisableComponent,
    ExampleBaseAdvancedOptionsComponent,
    ExampleSignalFormValueComponent,
    FormField
  ]
})
export class TimepickerExampleComponent {
  // 1. Signal Form - der empfohlene Weg.
  readonly signalModel = signal<{ timepickerValue: string | null }>({ timepickerValue: '14:30' });
  readonly signalForm = form(this.signalModel, (path) => {
    disabled(path.timepickerValue, { when: () => this.disabled() });
    readonly(path.timepickerValue, { when: () => this.readonly() });
    required(path.timepickerValue, { when: () => this.required() });
    validate(path.timepickerValue, luxTimeValue({ min: () => this.minTime(), max: () => this.maxTime() }));
  });

  // Datum und Uhrzeit mit gemeinsamem Wert "yyyy-MM-ddTHH:mm"
  readonly combinedSignalModel = signal<{ combinedValue: string | null }>({ combinedValue: '2026-06-18T14:30' });
  readonly combinedSignalForm = form(this.combinedSignalModel, (path) => {
    disabled(path.combinedValue, { when: () => this.disabled() });
    readonly(path.combinedValue, { when: () => this.readonly() });
    required(path.combinedValue, { when: () => this.required() });
    validate(
      path.combinedValue,
      luxDateTimeValue({
        minDate: () => this.limitMinDate(),
        maxDate: () => this.limitMaxDate(),
        minTime: () => this.minTimeFor(this.combinedSignalModel().combinedValue),
        maxTime: () => this.maxTimeFor(this.combinedSignalModel().combinedValue)
      })
    );
    // Eigener Validator: Die Auswahlliste zeigt dabei weiterhin alle Uhrzeiten.
    validate(path.combinedValue, ({ value }) => {
      if (!this.useCustomValidator()) {
        return undefined;
      }

      // Sekunden ":00" abschneiden, damit der Vergleich auch für "2026-06-18T14:30:00" stimmt.
      const dateTime = value()?.substring(0, 16);
      if (dateTime && dateTime < this.earliestDateTime()) {
        return { kind: 'terminZuFrueh', message: 'Der Termin liegt zu früh.' };
      }

      return dateTime && dateTime > this.latestDateTime() ? { kind: 'terminZuSpaet', message: 'Der Termin liegt zu spät.' } : undefined;
    });
  });

  // Datum und Uhrzeit als getrennte Werte. Nötig, wenn erkennbar sein muss, ob eine Uhrzeit gewählt wurde.
  readonly separateSignalModel = signal<{ datum: string | null; uhrzeit: string | null }>({ datum: '2026-06-18', uhrzeit: '14:30' });
  readonly separateSignalForm = form(this.separateSignalModel, (path) => {
    disabled(path.datum, { when: () => this.disabled() });
    disabled(path.uhrzeit, { when: () => this.disabled() });
    readonly(path.datum, { when: () => this.readonly() });
    readonly(path.uhrzeit, { when: () => this.readonly() });
    required(path.datum, { when: () => this.required() });
    required(path.uhrzeit, { when: () => this.required() });
    validate(path.datum, luxDateValue());
    validate(path.uhrzeit, luxTimeValue({ min: () => this.minTime(), max: () => this.maxTime() }));
  });
  readonly separateCombined = computed(() => {
    const { datum, uhrzeit } = this.separateSignalModel();
    return LuxUtil.isLocalDate(datum) && LuxUtil.isLocalTime(uhrzeit) ? LuxUtil.combineDateTime(datum, uhrzeit) : null;
  });

  // Grenzen aus Datum und Uhrzeit für alle Beispiele mit gemeinsamem Wert. Die Uhrzeit einer Grenze gilt nur am Tag der Grenze.
  readonly useDateTimeLimits = signal(false);
  readonly useCustomValidator = signal(false);
  readonly earliestDateTime = signal('2026-06-18T14:30');
  readonly latestDateTime = signal('2026-06-20T10:00');
  readonly limitMinDate = computed(() => (this.useDateTimeLimits() ? (splitLimit(this.earliestDateTime())?.date ?? null) : null));
  readonly limitMaxDate = computed(() => (this.useDateTimeLimits() ? (splitLimit(this.latestDateTime())?.date ?? null) : null));

  readonly limitsActive = computed(() => this.useDateTimeLimits() || this.useCustomValidator());

  // Der feste Text hat Vorrang und würde die Meldungen der Grenzen und des eigenen Validators verdecken.
  readonly combinedErrorMessage = computed(() => (this.useErrorMessage() && !this.limitsActive() ? this.errorMessage() : undefined));

  // 2. Freistehend, ohne jedes Formular.
  readonly plainValue = signal<string | null>('14:30');
  readonly combinedPlainValue = signal<string | null>('2026-06-18T14:30');

  readonly useErrorMessage = signal(true);
  readonly showOutputEvents = signal(false);
  form: FormGroup<TimepickerDummyForm>;
  readonly combinedFormValue: Signal<string | null>;
  controlBinding = 'timepickerExample';
  controlBindingCombined = 'combinedIsoExample';
  readonly value = signal('14:30');
  readonly combinedISO = signal('2026-06-18T14:30');

  readonly disabled = signal(false);
  readonly readonly = signal(false);
  readonly required = signal(false);
  readonly label = signal('Label');
  readonly hint = signal('Optionaler Zusatztext');
  readonly hintShowOnlyOnFocus = signal(false);
  readonly noTopLabel = signal(false);
  readonly noBottomLabel = signal(false);
  readonly noLabels = signal(false);
  readonly placeholder = signal('Placeholder');
  readonly errorMessage = signal('Das Feld enthält keinen gültigen Wert');
  readonly showToggle = signal(true);
  readonly opened = signal(false);
  readonly denseFormat = signal(false);
  readonly interval = signal('30m');
  readonly minTime = signal('08:00');
  readonly maxTime = signal('19:00');
  readonly defaultTime = signal('08:00');
  log = logResult;
  errorCallback = exampleErrorCallback;
  emptyCallback = emptyErrorCallback;
  errorCallbackString = this.errorCallback + '';

  constructor() {
    this.form = new FormGroup<TimepickerDummyForm>({
      timepickerExample: new FormControl<string | null>('14:30'),
      combinedIsoExample: new FormControl<string | null>('2026-06-18T14:30')
    });

    const combinedControl = this.form.controls.combinedIsoExample;
    this.combinedFormValue = toSignal(combinedControl.valueChanges, { initialValue: combinedControl.value });
  }

  minTimeFor(value: string | null): string | null {
    return this.useDateTimeLimits() ? timeLimit(value, this.earliestDateTime()) : this.minTime();
  }

  maxTimeFor(value: string | null): string | null {
    return this.useDateTimeLimits() ? timeLimit(value, this.latestDateTime()) : this.maxTime();
  }

  changeRequired(required: boolean) {
    this.required.set(required);

    const control = this.form.get(this.controlBinding);
    if (control) {
      control.setValidators(required ? [Validators.required] : []);
      control.updateValueAndValidity();
    }

    const combinedControl = this.form.get(this.controlBindingCombined);
    if (combinedControl) {
      combinedControl.setValidators(required ? [Validators.required] : []);
      combinedControl.updateValueAndValidity();
    }
  }
}

/**
 * Teilt eine Grenze "yyyy-MM-ddTHH:mm" auf. LuxUtil.splitDateTime() wirft bei einem anderen Format, z.B. während
 * der Eingabe in den Optionen.
 */
function splitLimit(value: string | null): { date: string; time: string } | null {
  return LuxUtil.isLocalDateTime(value) ? LuxUtil.splitDateTime(value) : null;
}

/**
 * Die Uhrzeit einer Grenze, wenn der gewählte Wert am Tag der Grenze liegt, sonst null.
 */
function timeLimit(value: string | null, limit: string): string | null {
  const selected = splitLimit(value);
  const parts = splitLimit(limit);
  return selected && selected.date === parts?.date ? parts.time : null;
}
