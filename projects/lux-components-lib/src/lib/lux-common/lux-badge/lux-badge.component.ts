import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxBadgeColor } from '../../lux-util/lux-colors.enum';

@Component({
  selector: 'lux-badge',
  templateUrl: './lux-badge.component.html',
  styleUrls: ['./lux-badge.component.scss'],
  imports: [NgClass, LuxIconComponent]
})
export class LuxBadgeComponent {
  readonly ICON_SIZE: string = '1x';
  readonly DEFAULT_BADGE_COLOR = 'gray';

  @Input() luxUppercase = true;
  @Input() luxIconName = '';
  @Input() luxColor: LuxBadgeColor = this.DEFAULT_BADGE_COLOR;
}
