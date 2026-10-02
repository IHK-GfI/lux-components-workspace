import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-card-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />'
})
export class LuxCardContentComponent {}
