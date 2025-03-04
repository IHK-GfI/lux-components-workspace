import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lux-checkbox-container-ac',
  templateUrl: './lux-checkbox-container-ac.component.html',
  imports: [NgClass]
})
export class LuxCheckboxContainerAcComponent {
  @Input() luxLabel = '';
  @Input() luxVertical = true;

  constructor() {}
}
