import { AfterContentInit, Component, ContentChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { LuxUtil } from '../../../lux-util/lux-util';

@Component({
  selector: 'lux-detail-view-ac',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: ''
})
export class LuxDetailViewAcComponent implements AfterContentInit {
  @ContentChild(TemplateRef) tempRef!: TemplateRef<any>;

  constructor() {}

  ngAfterContentInit() {
    LuxUtil.assertNonNull('tempRef', this.tempRef);
  }
}
