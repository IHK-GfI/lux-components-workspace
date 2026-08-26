import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-label',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<span [id]="luxId"><ng-content></ng-content></span>'
})
export class LuxLabelComponent implements OnInit {
  @Input() luxId?: string;

  constructor() {}

  ngOnInit() {
    if (!this.luxId) {
      console.warn('lux-label -> The property "luxId" is missing.');
    }
  }
}
