import { Component, ContentChildren, input, QueryList } from '@angular/core';
import { LuxMenuItemComponent } from '../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxDividerComponent } from '../../lux-divider/lux-divider.component';
import { LuxMenuSectionTitleComponent } from '../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-section-title.component';

@Component({
  selector: 'lux-app-header-ac-user-menu',
  template: ''
})
export class LuxAppHeaderAcUserMenuComponent {
  @ContentChildren(LuxMenuItemComponent) menuItemComponents!: QueryList<LuxMenuItemComponent>;
  @ContentChildren('menuSection') menuSectionComponents!: QueryList<
    LuxMenuItemComponent | LuxDividerComponent | LuxMenuSectionTitleComponent
  >;

  luxUseSectionsAndHeaderPanel = input<boolean>(false);

  constructor() {}
}
