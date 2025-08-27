import { Component, signal } from '@angular/core';
import { LuxToggleAcComponent } from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { TableEditWithFormExampleComponent } from './table-edit-with-form-example.component';
import { TableEditWithoutFormExampleComponent } from './table-edit-without-form-example.component';

@Component({
  selector: 'app-table-edit-example',
  templateUrl: './table-edit-example.component.html',
  styleUrls: ['./table-edit-example.component.scss'],
  imports: [
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    TableEditWithFormExampleComponent,
    TableEditWithoutFormExampleComponent,
    LuxToggleAcComponent
  ]
})
export class TableEditExampleComponent {
  validationEnabled = signal<boolean>(false);
}
