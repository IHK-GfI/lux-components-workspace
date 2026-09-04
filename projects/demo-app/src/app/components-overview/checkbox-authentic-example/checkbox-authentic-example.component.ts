import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LuxAutofocusDirective,
  LuxButtonComponent,
  LuxCheckboxComponent,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxTextboxComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { StatusMarkerComponent } from '../../base/status-marker/status-marker.component';
import { DemoMarkerType } from '../../base/status-marker/status-marker.model';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { emptyErrorCallback, exampleErrorCallback } from '../../example-base/example-base-util/example-base-helper';
import { ExampleFormDisableComponent } from '../../example-base/example-form-disable/example-form-disable.component';
import { ExampleFormValueComponent } from '../../example-base/example-form-value/example-form-value.component';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';

interface CheckboxDummyForm {
  checkboxExample: FormControl<boolean | null>;
}

interface CheckboxAgbDummyForm {
  checkbox1: FormControl<boolean>;
  checkbox2: FormControl<boolean>;
  checkbox3: FormControl<boolean>;
}

@Component({
  selector: 'lux-checkbox-authentic-example',
  templateUrl: './checkbox-authentic-example.component.html',
  styleUrls: ['./checkbox-authentic-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxTextboxComponent,
    LuxButtonComponent,
    LuxToggleComponent,
    LuxInputComponent,
    LuxFormHintComponent,
    LuxCheckboxComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleValueComponent,
    ReactiveFormsModule,
    ExampleFormValueComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleFormDisableComponent,
    StatusMarkerComponent
  ]
})
export class CheckboxAuthenticExampleComponent {
  readonly useErrorMessage = signal(true);
  readonly form = new FormGroup<CheckboxDummyForm>({
    checkboxExample: new FormControl<boolean | null>(null)
  });
  readonly agb = new FormGroup<CheckboxAgbDummyForm>({
    checkbox1: new FormControl<boolean>(false, { validators: Validators.required, nonNullable: true }),
    checkbox2: new FormControl<boolean>(false, { validators: Validators.required, nonNullable: true }),
    checkbox3: new FormControl<boolean>(false, { validators: Validators.required, nonNullable: true })
  });
  readonly exampleText =
    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.';
  readonly value = signal(false);
  readonly controlBinding = 'checkboxExample';
  readonly label = signal('Labeltext');
  readonly hint = signal('Optionaler Zusatztext');
  readonly hintShowOnlyOnFocus = signal(false);
  readonly noTopLabel = signal(true);
  readonly noBottomLabel = signal(false);
  readonly noLabels = signal(false);
  readonly markerTypeUpdated = DemoMarkerType.Updated;
  readonly disabled = signal(false);
  readonly readonly = signal(false);
  readonly required = signal(false);
  readonly denseFormat = signal(false);
  readonly errorMessage = signal('Das Feld enthält keinen gültigen Wert');
  readonly errorCallback = exampleErrorCallback;
  readonly emptyCallback = emptyErrorCallback;

  changeRequired(required: boolean) {
    this.required.set(required);
    if (required) {
      this.form.get(this.controlBinding)!.setValidators(Validators.requiredTrue);
    } else {
      this.form.get(this.controlBinding)!.setValidators(null);
    }
    this.form.get(this.controlBinding)!.updateValueAndValidity();
  }

  exampleValidator(showError: boolean) {
    Object.keys(this.agb.controls).forEach((key) => {
      if (showError) {
        this.agb.get(key)!.markAsTouched();
      } else {
        this.agb.get(key)!.markAsUntouched();
      }
      this.agb.get(key)!.updateValueAndValidity();
    });
  }
}
