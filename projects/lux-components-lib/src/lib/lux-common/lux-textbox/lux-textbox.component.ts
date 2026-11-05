import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxTextboxColor, LuxTextboxColors } from '../../lux-util/lux-colors.enum';

@Component({
  selector: 'lux-textbox',
  templateUrl: './lux-textbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, LuxIconComponent]
})
export class LuxTextboxComponent {
  readonly luxTitle = input('');
  readonly luxIcon = input('');

  readonly luxColor = input<LuxTextboxColor | undefined, LuxTextboxColor | undefined>(undefined, {
    transform: (value: LuxTextboxColor | undefined) => LuxTextboxColors.find((entry) => entry === value) ?? undefined
  });

  readonly luxHeading = input(3);
}
