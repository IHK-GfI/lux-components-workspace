import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-card-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />'
})
export class LuxCardInfoComponent {}
