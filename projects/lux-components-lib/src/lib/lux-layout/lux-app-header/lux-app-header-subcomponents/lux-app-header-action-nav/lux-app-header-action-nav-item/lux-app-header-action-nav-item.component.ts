import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, contentChild, input, output, viewChild } from '@angular/core';
import { LuxButtonComponent } from '../../../../../lux-action/lux-button/lux-button.component';
import { LuxThemePalette } from '../../../../../lux-util/lux-colors.enum';
import { LuxAppHeaderActionNavItemCustomComponent } from './lux-app-header-action-nav-item-custom.component';

@Component({
  selector: 'lux-app-header-action-nav-item',
  templateUrl: './lux-app-header-action-nav-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, LuxButtonComponent]
})
export class LuxAppHeaderActionNavItemComponent {
  readonly luxLabel = input('');
  readonly luxIconName = input<string | undefined>();
  readonly luxColor = input<LuxThemePalette>();
  readonly luxDisabled = input(false);
  readonly luxTagId = input<string | undefined>();

  readonly luxClicked = output<Event>();

  readonly buttonComponent = viewChild(LuxButtonComponent);
  readonly customComponent = contentChild(LuxAppHeaderActionNavItemCustomComponent);
}
