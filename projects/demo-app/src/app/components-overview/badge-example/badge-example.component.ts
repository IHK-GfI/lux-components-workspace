import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import {
  LuxBadgeColors,
  LuxBadgeComponent,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxLabelComponent,
  LuxToggleAcComponent
} from 'lux-components-lib';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-badge-example',
  templateUrl: './badge-example.component.html',
  imports: [
    LuxBadgeComponent,
    LuxLabelComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    NgStyle,
    ExampleBaseSimpleOptionsComponent,
    LuxFormHintComponent,
    LuxInputAcComponent,
    LuxToggleAcComponent
  ]
})
export class BadgeExampleComponent {
  colors = LuxBadgeColors;
  iconName = 'lux-interface-arrows-left-circle-1';
  text = 'Badge';
  uppercase = false;
  backgroundColor = '';

  constructor() {}
}
