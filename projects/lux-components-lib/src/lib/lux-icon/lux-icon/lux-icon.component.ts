import { NgClass, NgStyle } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, Output, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LuxIconColor } from '../../lux-util/lux-colors.enum';
import { LuxIconRegistryService } from './lux-icon-registry.service';

@Component({
  selector: 'lux-icon',
  templateUrl: './lux-icon.component.html',
  styleUrls: ['./lux-icon.component.scss'],
  imports: [MatIcon, NgStyle, NgClass]
})
export class LuxIconComponent {
  private iconReg = inject(LuxIconRegistryService);

  private _luxIconSize: string | undefined = '';
  private _luxIconName = '';
  private _luxPadding = '';
  private _backgroundCSSClass = '';
  private _fontCSSClass = 'blue';

  notFoundIconName = 'lux-interface-alert-warning-diamond';

  @HostBinding('style.margin') styleMargin = '0';
  @HostBinding('class.lux-icon-rounded') _luxRounded = false;

  @Input() luxColor?: LuxIconColor;

  @Input() set luxRounded(rounded: boolean) {
    this._luxRounded = rounded;
  }
  get luxRounded(): boolean {
    return this._luxRounded;
  }

  get luxMargin(): string {
    return this.styleMargin;
  }

  // 'standard margin Werte z.B. '5px 4px 3px 2px'
  @Input() set luxMargin(margin: string) {
    this.styleMargin = margin;
  }

  get luxPadding(): string {
    return this._luxPadding;
  }

  // standard padding Werte z.B. '5px 4px 3px 2px'
  @Input() set luxPadding(padding: string) {
    this._luxPadding = padding;
  }

  get luxIconSize(): string | undefined {
    return this._luxIconSize;
  }

  @Input() set luxIconSize(iconSizeValue: string | undefined) {
    this._luxIconSize = iconSizeValue;
    if (this.luxIconSize && this.luxIconSize.length === 2 && this.luxIconSize.endsWith('x')) {
      const size = this.luxIconSize.slice(0, 1);
      this._luxIconSize = size + 'em';
    } else if (this.luxIconSize) {
      this._luxIconSize = iconSizeValue;
    }
  }

  get luxIconName(): string | undefined {
    return this._luxIconName;
  }

  @Input()
  set luxIconName(iconNameValue: string | undefined) {
    if (iconNameValue) {
      this._luxIconName = iconNameValue;
      this.registerIcon(iconNameValue);
    } else {
      this._luxIconName = '';
    }
  }

  @Output() luxLoad = new EventEmitter<Event>();

  private registerIcon(iconName: string) {
    try {
      this.iconReg.registerIcon(iconName);
    } catch (error) {
      console.warn(
        `Das Icon "${iconName}" konnte nicht gefunden werden. Stattdessen wird das Icon "${this.notFoundIconName}" verwendet. Bitte anpassen!`
      );
      this.luxIconName = this.notFoundIconName;
    }
  }
}
