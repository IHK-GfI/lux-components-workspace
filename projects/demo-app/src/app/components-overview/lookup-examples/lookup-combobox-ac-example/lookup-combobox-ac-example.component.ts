import { JsonPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
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
    JsonPipe
  ]
})
export class LookupComboboxAcExampleComponent extends LookupExampleComponent implements OnInit {
  multiValue: LuxLookupTableEntry | LuxLookupTableEntry[] | null = null;
  entryBlockSize = 25;
  bLuxWithEmptyEntry = true;
  labelLongFormat = false;
  denseFormat = false;

  @ViewChildren(LuxLookupComboboxAcComponent) lookupComboboxCmp!: QueryList<LuxLookupComboboxAcComponent>;

  override ngOnInit() {
    super.ngOnInit();
  }

  reloadDataIntern() {
    this.lookupHandler.reloadData('normalcombobox');
    this.lookupHandler.reloadData('multicombobox');
    this.lookupHandler.reloadData('reactivecombobox');
  }
}
