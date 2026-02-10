import { Component } from '@angular/core';

@Component({
  selector: 'lux-card-custom-header',
  template: '<ng-content></ng-content>',
  host: { class: 'lux-flex lux-flex-auto' }
})
export class LuxCardCustomHeaderComponent {}
