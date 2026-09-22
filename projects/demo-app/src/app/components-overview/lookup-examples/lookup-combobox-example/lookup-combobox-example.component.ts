import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { disabled, FormField, form, readonly, required } from '@angular/forms/signals';
import {
  LuxAutofocusDirective,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxLookupComboboxComponent,
  LuxLookupTableEntry,
  LuxSelectComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { StatusMarkerComponent } from '../../../base/status-marker/status-marker.component';
import { DemoMarkerType } from '../../../base/status-marker/status-marker.model';
import { ExampleBaseContentComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { ExampleFormDisableComponent } from '../../../example-base/example-form-disable/example-form-disable.component';
import { ExampleFormValueComponent } from '../../../example-base/example-form-value/example-form-value.component';
import { ExampleSignalFormValueComponent } from '../../../example-base/example-signal-form-value/example-signal-form-value.component';
import { ExampleValueComponent } from '../../../example-base/example-value/example-value.component';
import { LookupExampleComponent } from '../lookup-example.component';

@Component({
  selector: 'app-lookup-combobox-example',
  templateUrl: './lookup-combobox-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxLookupComboboxComponent,
    LuxToggleComponent,
    LuxSelectComponent,
    LuxInputComponent,
    LuxFormHintComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleValueComponent,
    ReactiveFormsModule,
    ExampleFormValueComponent,
    ExampleSignalFormValueComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleFormDisableComponent,
    ExampleBaseAdvancedOptionsComponent,
    JsonPipe,
    StatusMarkerComponent,
    FormField
  ]
})
export class LookupComboboxExampleComponent extends LookupExampleComponent implements OnInit {
  readonly signalModel = signal({ lookupValue: null as any });
  readonly signalForm = form(this.signalModel, (path) => {
    disabled(path.lookupValue, { when: () => this.disabled() });
    readonly(path.lookupValue, { when: () => this.readonly() });
    required(path.lookupValue, { when: () => this.required() });
  });
  readonly signalMultiModel = signal({ lookupValue: null as any });
  readonly signalMultiForm = form(this.signalMultiModel, (path) => {
    disabled(path.lookupValue, { when: () => this.disabled() });
    readonly(path.lookupValue, { when: () => this.readonly() });
    required(path.lookupValue, { when: () => this.required() });
  });
  readonly plainValue = signal<any>(null);
  readonly multiValue = signal<LuxLookupTableEntry | LuxLookupTableEntry[] | null>(null);
  readonly markerTypeNew = DemoMarkerType.New;
  readonly entryBlockSize = signal(25);
  readonly bLuxWithEmptyEntry = signal(true);
  readonly enableFilter = signal(true);
  readonly filterPlaceholder = signal('Filter');
  readonly filterValue = signal('');
  readonly filterClearAriaLabel = signal('Clear filter');
  readonly visibleOptionCount = signal(0);
  readonly labelLongFormat = signal(false);
  readonly denseFormat = signal(false);

  override ngOnInit() {
    super.ngOnInit();
  }

  reloadDataIntern() {
    this.lookupHandler.reloadData('normalcombobox');
    this.lookupHandler.reloadData('multicombobox');
    this.lookupHandler.reloadData('reactivecombobox');
  }
}
