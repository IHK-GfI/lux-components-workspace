import { AfterViewInit, ChangeDetectionStrategy, Component, TemplateRef, viewChild } from '@angular/core';
import { LuxUtil } from '../../../../lux-util/lux-util';

@Component({
  selector: 'lux-app-header-action-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lux-app-header-action-nav.component.html'
})
export class LuxAppHeaderActionNavComponent implements AfterViewInit {
  readonly templateRef = viewChild.required(TemplateRef);

  ngAfterViewInit() {
    LuxUtil.assertNonNull('templateRef', this.templateRef());
  }
}
