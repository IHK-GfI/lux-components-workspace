import { ChangeDetectionStrategy, Component, contentChildren, input } from '@angular/core';
import { LuxMenuItemComponent } from '../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxDividerComponent } from '../../lux-divider/lux-divider.component';
import { LuxMenuSectionTitleComponent } from '../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-section-title.component';

@Component({
  selector: 'lux-app-header-ac-user-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class LuxAppHeaderAcUserMenuComponent {
  readonly luxUseSectionsAndHeaderPanel = input<boolean>(false);

  readonly menuItemComponents = contentChildren(LuxMenuItemComponent);
  readonly menuSectionComponents = contentChildren<LuxMenuItemComponent | LuxDividerComponent | LuxMenuSectionTitleComponent>('menuSection');
}
