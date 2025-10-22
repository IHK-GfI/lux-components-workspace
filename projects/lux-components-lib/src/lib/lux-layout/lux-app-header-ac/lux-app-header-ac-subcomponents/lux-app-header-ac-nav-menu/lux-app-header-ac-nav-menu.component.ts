import { NgClass } from '@angular/common';
import { Component, ContentChildren, Input, OnDestroy, QueryList, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { LuxButtonComponent } from '../../../../lux-action/lux-button/lux-button.component';
import { LuxMenuItemComponent } from '../../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxMenuTriggerComponent } from '../../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-trigger.component';
import { LuxMenuComponent } from '../../../../lux-action/lux-menu/lux-menu.component';
import { LuxAriaLabelDirective } from '../../../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxMediaQueryObserverService } from '../../../../lux-util/lux-media-query-observer.service';
import { LuxAppHeaderAcNavMenuItemComponent } from './lux-app-header-ac-nav-menu-item/lux-app-header-ac-nav-menu-item.component';

@Component({
  selector: 'lux-app-header-ac-nav-menu',
  templateUrl: './lux-app-header-ac-nav-menu.component.html',
  imports: [NgClass, LuxAriaLabelDirective, LuxMenuItemComponent, LuxMenuTriggerComponent, LuxButtonComponent, LuxMenuComponent, TranslocoPipe]
})
export class LuxAppHeaderAcNavMenuComponent implements OnDestroy {
  private queryService = inject(LuxMediaQueryObserverService);

  @ContentChildren(LuxAppHeaderAcNavMenuItemComponent) menuItemComponents!: QueryList<LuxAppHeaderAcNavMenuItemComponent>;

  @Input() luxNavMenuMaximumExtended = 5;

  mobileView: boolean;
  subscription: Subscription;
  navMenuOpened = false;

  constructor() {
    this.mobileView = this.queryService.activeMediaQuery === 'xs' || this.queryService.activeMediaQuery === 'sm';
    this.subscription = this.queryService.getMediaQueryChangedAsObservable().subscribe((query) => {
      this.mobileView = query === 'xs' || query === 'sm';
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  navMenuItemClicked(navItem: LuxAppHeaderAcNavMenuItemComponent, event: Event) {
    navItem.clicked(event);
  }

  onNavMenuOpend() {
    this.navMenuOpened = true;
  }
  onNavMenuClosed() {
    this.navMenuOpened = false;
  }
}
