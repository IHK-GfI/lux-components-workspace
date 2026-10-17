import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LuxMenuItemComponent } from '../../../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxThemePalette } from '../../../../../lux-util/lux-colors.enum';
@Component({
  selector: 'lux-app-header-ac-nav-menu-item',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<ng-content></ng-content>`
})
export class LuxAppHeaderAcNavMenuItemComponent extends LuxMenuItemComponent {
  @Input() luxSelected = false;
  @Input() override luxButtonBadgeColor: LuxThemePalette = 'primary';

  constructor() {
    super();
  }
}
