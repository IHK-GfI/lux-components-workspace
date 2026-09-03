import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatCard, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import {
  LuxBadgeNotificationColor,
  LuxBadgeNotificationDirective,
  LuxBadgeNotificationSize
} from '../../lux-directives/lux-badge-notification/lux-badge-notification.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxTooltipDirective } from '../../lux-directives/lux-tooltip/lux-tooltip.directive';

@Component({
  selector: 'lux-tile-ac',
  templateUrl: './lux-tile-ac.component.html',
  imports: [MatCard, LuxTagIdDirective, LuxBadgeNotificationDirective, MatCardTitle, MatCardSubtitle, LuxTooltipDirective, MatCardHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'lux-flex' }
})
export class LuxTileAcComponent {
  readonly luxLabel = input<string | undefined>();
  readonly luxLabelTruncateAfterOneLine = input(false);
  readonly luxLabelTruncateAfterTwoLines = input(false);
  readonly luxSubTitle = input<string | undefined>();
  readonly luxSubTitleTruncateAfterOneLine = input(false);
  readonly luxSubTitleTruncateAfterTwoLines = input(false);
  readonly luxTagId = input<string | undefined>();
  readonly luxShowNotification = input(false);
  readonly luxCounter = input<number | undefined>();
  readonly luxCounterCap = input(10);
  readonly luxNotificationColor = input<LuxBadgeNotificationColor>('primary');
  readonly luxNotificationSize = input<LuxBadgeNotificationSize>('medium');

  readonly luxClicked = output<void>();

  readonly luxBadgeContent = computed(() => {
    const counter = this.luxCounter();
    if (!counter) {
      return this.luxShowNotification() ? ' ' : '';
    }
    return '' + counter;
  });

  clicked() {
    this.luxClicked.emit();
  }
}
