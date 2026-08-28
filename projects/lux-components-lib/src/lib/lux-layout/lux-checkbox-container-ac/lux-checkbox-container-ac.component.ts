import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lux-checkbox-container-ac',
  templateUrl: './lux-checkbox-container-ac.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass]
})
export class LuxCheckboxContainerAcComponent {
  readonly luxLabel = input('');
  readonly luxVertical = input(true);
  readonly luxShowRequiredMarker = input(false);
}
