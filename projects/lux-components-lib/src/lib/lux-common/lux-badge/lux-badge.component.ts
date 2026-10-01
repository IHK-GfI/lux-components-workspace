import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxBadgeColor, LuxBadgeSize } from '../../lux-util/lux-colors.enum';

@Component({
  selector: 'lux-badge',
  templateUrl: './lux-badge.component.html',
  styleUrls: ['./lux-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, LuxIconComponent]
})
export class LuxBadgeComponent {
  readonly luxUppercase = input(true);
  readonly luxIconName = input('');
  readonly luxColor = input<LuxBadgeColor>('gray');
  readonly luxMuted = input(false);
  readonly luxSize = input<LuxBadgeSize>('');

  readonly ICON_SIZE = '1x';
}
