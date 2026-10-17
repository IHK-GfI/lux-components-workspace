import { NgClass } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-checkbox-container-ac',
  templateUrl: './lux-checkbox-container-ac.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgClass]
})
export class LuxCheckboxContainerAcComponent {
  @Input() luxLabel = '';
  @Input() luxVertical = true;
  @Input() luxShowRequiredMarker = false;

  constructor() {}
}
