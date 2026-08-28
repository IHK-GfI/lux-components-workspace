import { AfterViewInit, ChangeDetectionStrategy, Component, contentChild, contentChildren, TemplateRef, viewChild } from '@angular/core';
import { LuxUtil } from '../../../../lux-util/lux-util';
import { LuxAppHeaderAcActionNavItemComponent } from './lux-app-header-ac-action-nav-item/lux-app-header-ac-action-nav-item.component';
import { LuxAppHeaderAcSessionTimerComponent } from '../lux-app-header-ac-session-timer/lux-app-header-ac-session-timer';

@Component({
  selector: 'lux-app-header-ac-action-nav',
  templateUrl: './lux-app-header-ac-action-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAppHeaderAcSessionTimerComponent]
})
export class LuxAppHeaderAcActionNavComponent implements AfterViewInit {
  readonly templateRef = viewChild.required(TemplateRef);
  readonly menuItemComponents = contentChildren(LuxAppHeaderAcActionNavItemComponent);
  readonly sessionTimerComponent = contentChild(LuxAppHeaderAcSessionTimerComponent);

  ngAfterViewInit() {
    LuxUtil.assertNonNull('templateRef', this.templateRef());
  }
}
