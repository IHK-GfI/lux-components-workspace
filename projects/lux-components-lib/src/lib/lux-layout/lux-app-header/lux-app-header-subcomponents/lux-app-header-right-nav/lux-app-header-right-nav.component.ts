import { ChangeDetectionStrategy, Component, contentChildren } from '@angular/core';
import { LuxMenuItemComponent } from '../../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';

@Component({
  selector: 'lux-app-header-right-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class LuxAppHeaderRightNavComponent {
  readonly menuItemComponents = contentChildren(LuxMenuItemComponent);
}
