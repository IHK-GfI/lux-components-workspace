import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxTextboxColor, LuxTextboxColors } from '../../lux-util/lux-colors.enum';

@Component({
  selector: 'lux-textbox',
  templateUrl: './lux-textbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, LuxIconComponent]
})
export class LuxTextboxComponent {
  private _luxColor?: LuxTextboxColor;

  @Input() luxTitle = '';
  @Input() luxIcon = '';
  @Input()
  set luxColor(value: LuxTextboxColor | undefined) {
    this._luxColor = LuxTextboxColors.find((entry) => entry === value) ?? undefined;
  }

  get luxColor(): LuxTextboxColor | undefined {
    return this._luxColor;
  }
  @Input() luxHeading = 3;
  constructor() {}
}
