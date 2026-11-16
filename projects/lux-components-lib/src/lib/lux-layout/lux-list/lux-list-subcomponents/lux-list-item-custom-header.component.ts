import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-list-item-custom-header',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'lux-flex lux-flex-auto' }
})
export class LuxListItemCustomHeaderComponent {}
