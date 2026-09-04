import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LuxAutofocusDirective, LuxFormHintComponent, LuxInputComponent, LuxToggleComponent } from '@ihk-gfi/lux-components';
import { StatusMarkerComponent } from '../../base/status-marker/status-marker.component';
import { DemoMarkerType } from '../../base/status-marker/status-marker.model';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { emptyErrorCallback, exampleErrorCallback } from '../../example-base/example-base-util/example-base-helper';
import { ExampleFormDisableComponent } from '../../example-base/example-form-disable/example-form-disable.component';
import { ExampleFormValueComponent } from '../../example-base/example-form-value/example-form-value.component';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';

interface ToggleDummyForm {
  toggleExample: FormControl<boolean | null>;
}

@Component({
  selector: 'lux-toggle-authentic-example',
  templateUrl: './toggle-authentic-example.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxToggleComponent,
    LuxInputComponent,
    LuxFormHintComponent,
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
export class ToggleAuthenticExampleComponent {
  readonly useErrorMessage = signal(true);
  form: FormGroup<ToggleDummyForm>;
  readonly value = signal(false);
  controlBinding = 'toggleExample';
  readonly label = signal('Label');
  readonly hint = signal('Hint');
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
  errorCallback = exampleErrorCallback;
  emptyCallback = emptyErrorCallback;

  constructor() {
    this.form = new FormGroup<ToggleDummyForm>({
      toggleExample: new FormControl<boolean | null>(null)
    });
  }

  changeRequired(required: boolean) {
    this.required.set(required);
    if (required) {
      this.form.get(this.controlBinding)!.setValidators(Validators.requiredTrue);
    } else {
      this.form.get(this.controlBinding)!.setValidators(null);
    }
    this.form.get(this.controlBinding)!.updateValueAndValidity();
  }
}
