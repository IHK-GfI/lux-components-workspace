import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, contentChild, input, output, viewChild } from '@angular/core';
import { LuxButtonComponent } from '../../../../../lux-action/lux-button/lux-button.component';
import { LuxThemePalette } from '../../../../../lux-util/lux-colors.enum';
import { LuxAppHeaderAcActionNavItemCustomComponent } from './lux-app-header-ac-action-nav-item-custom.component';

@Component({
  selector: 'lux-app-header-ac-action-nav-item',
  templateUrl: './lux-app-header-ac-action-nav-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, LuxButtonComponent]
})
export class LuxAppHeaderAcActionNavItemComponent {
  readonly luxLabel = input('');
  readonly luxIconName = input<string | undefined>();
  readonly luxColor = input<LuxThemePalette>();
  readonly luxDisabled = input(false);
  readonly luxTagId = input<string | undefined>();

  readonly luxClicked = output<Event>();

  readonly buttonComponent = viewChild(LuxButtonComponent);
  readonly customComponent = contentChild(LuxAppHeaderAcActionNavItemCustomComponent);
}
