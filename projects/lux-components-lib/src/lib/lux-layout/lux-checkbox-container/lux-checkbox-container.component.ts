import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lux-checkbox-container, lux-checkbox-container-ac',
  templateUrl: './lux-checkbox-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass]
})
export class LuxCheckboxContainerComponent {
  readonly luxLabel = input('');
  readonly luxVertical = input(true);
  readonly luxShowRequiredMarker = input(false);
}
