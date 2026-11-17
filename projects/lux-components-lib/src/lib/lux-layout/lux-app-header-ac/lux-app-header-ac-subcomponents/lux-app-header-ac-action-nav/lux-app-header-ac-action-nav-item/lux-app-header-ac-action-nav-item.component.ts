import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, contentChild, forwardRef, input, output, viewChild } from '@angular/core';
import { LuxButtonComponent } from '../../../../../lux-action/lux-button/lux-button.component';
import { LUX_TOOLTIP_HOST, LuxTooltipHost } from '../../../../../lux-directives/lux-tooltip/lux-tooltip-host';
import { LuxTooltipDirective } from '../../../../../lux-directives/lux-tooltip/lux-tooltip.directive';
import { LuxThemePalette } from '../../../../../lux-util/lux-colors.enum';
import { LuxAppHeaderAcActionNavItemCustomComponent } from './lux-app-header-ac-action-nav-item-custom.component';

@Component({
  selector: 'lux-app-header-ac-action-nav-item',
  templateUrl: './lux-app-header-ac-action-nav-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, LuxButtonComponent],
  providers: [{ provide: LUX_TOOLTIP_HOST, useExisting: forwardRef(() => LuxAppHeaderAcActionNavItemComponent) }]
})
export class LuxAppHeaderAcActionNavItemComponent implements LuxTooltipHost {
  readonly luxLabel = input('');
  readonly luxIconName = input<string | undefined>();
  readonly luxColor = input<LuxThemePalette>();
  readonly luxDisabled = input(false);
  readonly luxTagId = input<string | undefined>();

  readonly luxClicked = output<Event>();

  readonly buttonComponent = viewChild(LuxButtonComponent);
  readonly customComponent = contentChild(LuxAppHeaderAcActionNavItemCustomComponent);

  registerTooltip(tooltip: LuxTooltipDirective) {
    const button = this.buttonComponent();
    if (button) {
      button.tooltipDirective = tooltip;
    }
  }
}
