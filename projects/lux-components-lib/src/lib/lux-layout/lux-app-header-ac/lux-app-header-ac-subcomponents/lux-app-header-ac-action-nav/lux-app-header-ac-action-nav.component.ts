import { AfterViewInit, Component, ContentChild, ContentChildren, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { LuxUtil } from '../../../../lux-util/lux-util';
import { LuxAppHeaderAcActionNavItemComponent } from './lux-app-header-ac-action-nav-item/lux-app-header-ac-action-nav-item.component';
import { LuxAppHeaderAcSessionTimerComponent } from '../lux-app-header-ac-session-timer/lux-app-header-ac-session-timer';

@Component({
  selector: 'lux-app-header-ac-action-nav',
  templateUrl: './lux-app-header-ac-action-nav.component.html',
  imports: [LuxAppHeaderAcSessionTimerComponent]
})
export class LuxAppHeaderAcActionNavComponent implements AfterViewInit {
  @ViewChild(TemplateRef, { static: true }) templateRef!: TemplateRef<any>;
  @ContentChildren(LuxAppHeaderAcActionNavItemComponent) menuItemComponents!: QueryList<LuxAppHeaderAcActionNavItemComponent>;
  @ContentChild(LuxAppHeaderAcSessionTimerComponent) sessionTimerComponent?: LuxAppHeaderAcSessionTimerComponent;

  constructor() {}

  ngAfterViewInit() {
    LuxUtil.assertNonNull('templateRef', this.templateRef);
  }
}
