import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LuxButtonToggleComponent,
  LuxButtonToggleOption,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxSelectComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { StatusMarkerComponent } from '../../base/status-marker/status-marker.component';
import { DemoMarkerType } from '../../base/status-marker/status-marker.model';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';

interface ButtonToggleValue {
  key: string;
}

interface VerticalOption {
  label: string;
  value?: boolean;
}

interface ButtonToggleDemoForm {
  singleSelect: FormControl<ButtonToggleValue | null>;
  multiSelect: FormControl<ButtonToggleValue[] | null>;
}

@Component({
  selector: 'app-button-toggle-example',
  templateUrl: './button-toggle-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    LuxButtonToggleComponent,
    LuxInputComponent,
    LuxSelectComponent,
    LuxToggleComponent,
    StatusMarkerComponent,
    LuxFormHintComponent,
    ExampleValueComponent,
    ReactiveFormsModule
  ]
})
export class ButtonToggleExampleComponent {
  readonly markerTypeNew = DemoMarkerType.New;
  readonly showOutputEvents = signal(false);

  readonly ariaLabel = signal<string | undefined>(undefined);
  readonly hint = signal('Bitte treffen Sie eine Auswahl.');
  readonly error = signal('');
  readonly disabled = signal(false);
  readonly dense = signal(false);
  readonly verticalOptions: VerticalOption[] = [
    { label: 'Automatisch', value: undefined },
    { label: 'Vertikal', value: true },
    { label: 'Horizontal', value: false }
  ];
  readonly verticalOption = signal<VerticalOption>(this.verticalOptions[0]);
  readonly vertical = computed(() => this.verticalOption()?.value);

  readonly singleSelected = signal<ButtonToggleValue | undefined>(undefined);
  readonly multiSelected = signal<ButtonToggleValue[]>([]);
  readonly required = signal(false);

  readonly form = new FormGroup<ButtonToggleDemoForm>({
    singleSelect: new FormControl<ButtonToggleValue | null>(null),
    multiSelect: new FormControl<ButtonToggleValue[] | null>(null)
  });

  readonly singleOptions: LuxButtonToggleOption<ButtonToggleValue>[] = [
    { label: 'Übersicht', value: { key: 'overview' } },
    { label: 'Details', value: { key: 'details' } },
    { label: 'Aktivität', value: { key: 'activity' } }
  ];

  readonly multiOptions: LuxButtonToggleOption<ButtonToggleValue>[] = [
    { label: 'Übersicht', value: { key: 'overview' } },
    { label: 'Details', value: { key: 'details' } },
    { label: 'Aktivität', value: { key: 'activity' } },
    { label: 'Archiv', value: { key: 'archive' }, disabled: true }
  ];

  readonly log = logResult;

  onSingleChanged(value: ButtonToggleValue | undefined) {
    this.log(this.showOutputEvents(), 'luxSelectedChange', value);
  }

  onMultiChanged(values: ButtonToggleValue[]) {
    this.log(this.showOutputEvents(), 'luxSelectedValuesChange', values);
  }

  changeRequired(required: boolean) {
    this.required.set(required);

    ['singleSelect', 'multiSelect'].forEach((controlName) => {
      const control = this.form.get(controlName);
      if (!control) {
        return;
      }

      control.setValidators(required ? [Validators.required] : null);
      control.updateValueAndValidity();
    });
  }
}
