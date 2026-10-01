import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-panel-aria-header-custom',
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- TODO: aus develop übernommen, Umstellung auf OnPush folgt separat
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class LuxPanelAriaHeaderCustomComponent {}
