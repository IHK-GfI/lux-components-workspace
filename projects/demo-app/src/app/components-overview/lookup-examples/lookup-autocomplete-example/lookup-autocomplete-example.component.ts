import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { disabled, FormField, form, readonly, required } from '@angular/forms/signals';
import {
  LuxAutofocusDirective,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxLookupAutocompleteComponent,
  LuxSelectComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
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
  selector: 'app-lookup-autocomplete-example',
  templateUrl: './lookup-autocomplete-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxLookupAutocompleteComponent,
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
    FormField
  ]
})
export class LookupAutocompleteExampleComponent extends LookupExampleComponent implements OnInit {
  readonly signalModel = signal<{ lookupValue: any }>({ lookupValue: null });
  readonly signalForm = form(this.signalModel, (path) => {
    disabled(path.lookupValue, { when: () => this.disabled() });
    readonly(path.lookupValue, { when: () => this.readonly() });
    required(path.lookupValue, { when: () => this.required() });
  });
  readonly plainValue = signal<any>(null);
  readonly debounceTime = signal(250);
  readonly maximumDisplayed = signal(50);
  readonly labelLongFormat = signal(false);
  readonly denseFormat = signal(false);
  readonly clearable = signal(false);

  override ngOnInit() {
    super.ngOnInit();
  }

  reloadDataIntern() {
    this.lookupHandler.reloadData('normalautocomplete');
    this.lookupHandler.reloadData('reactiveautocomplete');
  }
}
