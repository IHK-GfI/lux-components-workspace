import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxBadgeColor, LuxBadgeColors } from '../../lux-util/lux-colors.enum';
import { LuxUtil } from '../../lux-util/lux-util';

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

  constructor() {
    this.luxColor = this.DEFAULT_BADGE_COLOR;
  }

  private _backgroundCSSClass = '';

  get backgroundCSSClass() {
    return this._backgroundCSSClass;
  }

  private _fontCSSClass = '';

  public get fontCSSClass() {
    return this._fontCSSClass;
  }

  @Input()
  set luxColor(color: LuxBadgeColor) {
    const result = LuxUtil.getColorsByBgColorsEnum(color);
    this._backgroundCSSClass = result.backgroundCSSClass;
    this._fontCSSClass = result.fontCSSClass;

    if (!LuxBadgeColors.find((entry) => entry === color)) {
      this.luxColor = this.DEFAULT_BADGE_COLOR;
    }
  }
}
