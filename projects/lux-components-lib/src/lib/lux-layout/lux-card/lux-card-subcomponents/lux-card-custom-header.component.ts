import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-card-custom-header',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'lux-flex lux-flex-auto' }
})
export class LuxCardCustomHeaderComponent {}
