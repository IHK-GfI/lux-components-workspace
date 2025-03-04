import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { LuxDividerComponent, LuxFormHintComponent, LuxToggleAcComponent } from 'lux-components-lib';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-divider-example',
  templateUrl: './divider-example.component.html',
  imports: [
    LuxDividerComponent,
    LuxToggleAcComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    NgClass,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class DividerExampleComponent {
  inset = false;
  vertical = false;

  constructor() {}
}
