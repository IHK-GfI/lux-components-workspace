import { UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
    LuxAutocompleteAcComponent,
    LuxCardComponent,
    LuxCardContentComponent,
    LuxCheckboxAcComponent,
    LuxChipAcGroupComponent,
    LuxChipsAcComponent,
    LuxDatepickerAcComponent,
    LuxInputAcComponent,
    LuxLinkComponent,
    LuxRadioAcComponent,
    LuxSelectAcComponent,
    LuxTabIndexDirective,
    LuxTextareaAcComponent,
    LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'lux-tabindex-example',
  templateUrl: './tabindex-example.component.html',
  imports: [
    LuxLinkComponent,
    LuxCardContentComponent,
    LuxCardComponent,
    LuxTabIndexDirective,
    LuxToggleAcComponent,
    LuxTextareaAcComponent,
    LuxSelectAcComponent,
    LuxRadioAcComponent,
    LuxInputAcComponent,
    LuxDatepickerAcComponent,
    LuxChipsAcComponent,
    LuxChipAcGroupComponent,
    LuxCheckboxAcComponent,
    LuxAutocompleteAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    UpperCasePipe
  ]
})
export class TabindexExampleComponent {
  chipItems = ['Test1', 'Test2'];
  options = [{ label: 'Test1' }, { label: 'Test2' }];

  constructor() {}
}
