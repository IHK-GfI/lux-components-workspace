import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal, viewChildren } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  LuxAutofocusDirective,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxLookupComboboxAcComponent,
  LuxLookupTableEntry,
  LuxSelectAcComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { DemoMarkerType } from '../../../base/status-marker/status-marker.model';
import { StatusMarkerComponent } from '../../../base/status-marker/status-marker.component';
import { ExampleBaseContentComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { ExampleFormDisableComponent } from '../../../example-base/example-form-disable/example-form-disable.component';
import { ExampleFormValueComponent } from '../../../example-base/example-form-value/example-form-value.component';
import { ExampleValueComponent } from '../../../example-base/example-value/example-value.component';
import { LookupExampleComponent } from '../lookup-example.component';

@Component({
  selector: 'app-lookup-combobox-ac-example',
  templateUrl: './lookup-combobox-ac-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxLookupComboboxAcComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleValueComponent,
    ReactiveFormsModule,
    ExampleFormValueComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleFormDisableComponent,
    ExampleBaseAdvancedOptionsComponent,
    JsonPipe,
    StatusMarkerComponent
  ]
})
export class LookupComboboxAcExampleComponent extends LookupExampleComponent implements OnInit {
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
  value336 = {
    key: '336',
    kurzText: 'Eritrea',
    langText1: 'Eritrea'
  };
  valuea504 = {
    key: '504',
    kurzText: 'Peru',
    langText1: 'Peru'
  };

  readonly lookupComboboxCmp = viewChildren(LuxLookupComboboxAcComponent);

  override ngOnInit() {
    super.ngOnInit();
  }

  reloadDataIntern() {
    this.lookupHandler.reloadData('normalcombobox');
    this.lookupHandler.reloadData('multicombobox');
    this.lookupHandler.reloadData('reactivecombobox');
  }

  on336And504Change(checked: boolean) {
    if (checked) {
      this.value.set(this.value336);
      this.multiValue.set([this.value336, this.valuea504]);
      this.form.get(this.controlBinding)?.setValue(this.value336);
    } else {
      this.value.set(null);
      this.multiValue.set([]);
      this.form.get(this.controlBinding)?.setValue(null);
    }
  }
}
