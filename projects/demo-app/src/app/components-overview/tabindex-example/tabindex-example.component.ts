import { UpperCasePipe } from '@angular/common';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  LuxAutocompleteComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxCheckboxComponent,
  LuxChipGroupComponent,
  LuxChipsComponent,
  LuxDatepickerComponent,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxLinkComponent,
  LuxRadioComponent,
  LuxSelectComponent,
  LuxTabIndexDirective,
  LuxTextareaComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'lux-tabindex-example',
  templateUrl: './tabindex-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxLinkComponent,
    LuxCardContentComponent,
    LuxCardComponent,
    LuxTabIndexDirective,
    LuxToggleComponent,
    LuxTextareaComponent,
    LuxSelectComponent,
    LuxRadioComponent,
    LuxInputComponent,
    LuxDatepickerComponent,
    LuxChipsComponent,
    LuxChipGroupComponent,
    LuxCheckboxComponent,
    LuxAutocompleteComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    UpperCasePipe,
    ExampleBaseSimpleOptionsComponent,
    LuxFormHintComponent
  ]
})
export class TabindexExampleComponent {
  readonly wrongTabIndex = signal(false);
  chipItems = ['Test1', 'Test2'];
  options = [{ label: 'Test1' }, { label: 'Test2' }];
}
