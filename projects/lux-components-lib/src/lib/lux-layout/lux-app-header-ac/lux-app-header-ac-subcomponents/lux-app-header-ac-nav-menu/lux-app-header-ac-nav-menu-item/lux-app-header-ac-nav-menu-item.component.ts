import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LuxMenuItemComponent } from '../../../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
@Component({
  selector: 'lux-app-header-ac-nav-menu-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`
})
export class LuxAppHeaderAcNavMenuItemComponent extends LuxMenuItemComponent {
  readonly luxSelected = input(false);
}
