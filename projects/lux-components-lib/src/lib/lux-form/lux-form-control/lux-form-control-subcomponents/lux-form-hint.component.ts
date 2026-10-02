import { AfterViewInit, ChangeDetectionStrategy, Component, TemplateRef, viewChild } from '@angular/core';
import { LuxUtil } from '../../../lux-util/lux-util';

@Component({
  selector: 'lux-form-hint',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-template><ng-content></ng-content></ng-template>'
})
export class LuxFormHintComponent implements AfterViewInit {
  readonly templateRef = viewChild.required(TemplateRef);

  ngAfterViewInit() {
    LuxUtil.assertNonNull('templateRef', this.templateRef());
  }
}
