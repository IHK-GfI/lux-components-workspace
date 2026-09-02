import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ILuxFileObject,
  LuxAutocompleteAcComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxCardContentExpandedComponent,
  LuxCheckboxAcComponent,
  LuxDatepickerAcComponent,
  LuxFileInputAcComponent,
  LuxFormHintComponent,
  LuxFormLabelComponent,
  LuxIconComponent,
  LuxInputAcComponent,
  LuxInputAcPrefixComponent,
  LuxInputAcSuffixComponent,
  LuxRadioAcComponent,
  LuxSelectAcComponent,
  LuxSliderAcComponent,
  LuxTextareaAcComponent,
  LuxTextboxComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';

interface DummyForm {
  input: FormControl<string | null>;
  textarea: FormControl<string>;
  datepicker: FormControl<string>;
  autocomplete: FormControl<string>;
  select: FormControl<string>;
  radio: FormControl<string>;
  checkbox: FormControl<boolean>;
  toggle: FormControl<boolean>;
  slider: FormControl<number>;
  file: FormControl<ILuxFileObject | null>;
}

@Component({
  selector: 'lux-baseline',
  templateUrl: './baseline.component.html',
  styleUrls: ['./baseline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.show-frames]': 'showFrames()'
  },
  imports: [
    LuxIconComponent,
    LuxTextboxComponent,
    LuxCardContentExpandedComponent,
    LuxCardContentComponent,
    LuxCardComponent,
    NgClass,
    ReactiveFormsModule,
    LuxAutocompleteAcComponent,
    LuxCheckboxAcComponent,
    LuxDatepickerAcComponent,
    LuxFileInputAcComponent,
    LuxFormHintComponent,
    LuxFormLabelComponent,
    LuxInputAcComponent,
    LuxInputAcPrefixComponent,
    LuxInputAcSuffixComponent,
    LuxRadioAcComponent,
    LuxSelectAcComponent,
    LuxSliderAcComponent,
    LuxTextareaAcComponent,
    LuxToggleAcComponent
  ]
})
export class BaselineComponent {
  readonly showFrames = signal(false);
  readonly showAsColumn = signal(false);
  readonly disabled = signal(false);
  readonly readonly = signal(false);
  readonly denseFormat = signal(false);
  form: FormGroup<DummyForm>;

  constructor() {
    this.form = new FormGroup<DummyForm>({
      input: new FormControl(null, { validators: Validators.required, nonNullable: false }),
      textarea: new FormControl('', { validators: Validators.required, nonNullable: true }),
      datepicker: new FormControl('', { validators: Validators.required, nonNullable: true }),
      autocomplete: new FormControl('', { validators: Validators.required, nonNullable: true }),
      select: new FormControl('', { validators: Validators.required, nonNullable: true }),
      radio: new FormControl('', { validators: Validators.required, nonNullable: true }),
      checkbox: new FormControl(false, { validators: Validators.required, nonNullable: true }),
      toggle: new FormControl(false, { validators: Validators.required, nonNullable: true }),
      slider: new FormControl(4, { validators: Validators.min(10), nonNullable: true }),
      file: new FormControl<ILuxFileObject | null>(null, Validators.required)
    });
  }

  toggleErrors(showErrorState: boolean) {
    Object.keys(this.form.controls).forEach((key) => {
      if (showErrorState) {
        this.form.get(key)!.markAsTouched();
      } else {
        this.form.get(key)!.markAsUntouched();
      }
      this.form.get(key)!.updateValueAndValidity();
    });
  }
}
