import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  LuxBadgeNotificationDirective,
  LuxBadgeNotificationPosition,
  LuxBadgeNotificationSize,
  LuxButtonComponent,
  LuxIconComponent,
  LuxInputAcComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-badge-notification-example',
  templateUrl: './badge-notification-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  readonly notification = signal(' ');
  readonly color = signal('default');
  readonly disabled = signal(false);
  readonly hidden = signal(false);
  readonly position = signal<LuxBadgeNotificationPosition>('above after');
  readonly size = signal<LuxBadgeNotificationSize>('medium');
  readonly overlap = signal(true);
  readonly cap = signal(0);
  readonly noBorder = signal(false);
}
