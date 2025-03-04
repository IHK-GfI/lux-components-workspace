import { Component } from '@angular/core';
import {
  LuxBadgeNotificationDirective,
  LuxBadgeNotificationPosition,
  LuxBadgeNotificationSize,
  LuxButtonComponent,
  LuxIconComponent,
  LuxInputAcComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent
} from 'lux-components-lib';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-badge-notification-example',
  templateUrl: './badge-notification-example.component.html',
  imports: [
    LuxIconComponent,
    LuxButtonComponent,
    LuxBadgeNotificationDirective,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class BadgeNotificationExampleComponent {
  notification = ' ';
  color = 'default';
  disabled = false;
  hidden = false;
  position: LuxBadgeNotificationPosition = 'above after';
  size: LuxBadgeNotificationSize = 'medium';
  overlap = true;
  cap = 0;
  noBorder = false;

  constructor() {}
}
