import { Component } from '@angular/core';

@Component({
  selector: 'lux-list-item-custom-header',
  template: '<ng-content></ng-content>',
  host: { class: 'lux-flex lux-flex-auto' }
})
export class LuxListItemCustomHeaderComponent {}
