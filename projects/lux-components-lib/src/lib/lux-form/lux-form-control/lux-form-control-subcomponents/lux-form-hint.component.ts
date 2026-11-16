import { AfterViewInit, Component, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { LuxUtil } from '../../../lux-util/lux-util';

@Component({
  selector: 'lux-form-hint',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<ng-template><ng-content></ng-content></ng-template>'
})
export class LuxFormHintComponent implements AfterViewInit {
  @ViewChild(TemplateRef, { static: true }) templateRef!: TemplateRef<any>;

  constructor() {}

  ngAfterViewInit() {
    LuxUtil.assertNonNull('templateRef', this.templateRef);
  }
}
