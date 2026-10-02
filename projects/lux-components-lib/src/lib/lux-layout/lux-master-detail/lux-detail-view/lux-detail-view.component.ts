import { AfterContentInit, ChangeDetectionStrategy, Component, contentChild, TemplateRef } from '@angular/core';
import { LuxUtil } from '../../../lux-util/lux-util';

@Component({
  selector: 'lux-detail-view, lux-detail-view-ac',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class LuxDetailViewComponent implements AfterContentInit {
  readonly tempRef = contentChild.required(TemplateRef);

  ngAfterContentInit() {
    LuxUtil.assertNonNull('tempRef', this.tempRef());
  }
}
