import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LuxMenuItemComponent } from '../../../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
@Component({
  selector: 'lux-app-header-ac-nav-menu-item',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<ng-content></ng-content>`
})
export class LuxAppHeaderAcNavMenuItemComponent extends LuxMenuItemComponent {
  @Input() luxSelected = false;

  constructor() {
    super();
  }
}
