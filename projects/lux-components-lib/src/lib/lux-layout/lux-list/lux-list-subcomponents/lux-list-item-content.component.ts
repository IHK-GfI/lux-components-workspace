import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-list-item-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />'
})
export class LuxListItemContentComponent {}
