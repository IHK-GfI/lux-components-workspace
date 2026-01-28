import { NgClass } from '@angular/common';
import { Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LuxAlphabeticallySortedPipe, LuxAriaLabelDirective, LuxAriaRoleDirective, LuxBadgeNotificationDirective, LuxButtonComponent, LuxLinkPlainComponent, LuxMediaQueryObserverService, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent, LuxUtil } from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { ComponentsOverviewNavigationService } from '../../components-overview/components-overview-navigation.service';

@Component({
  selector: 'example-root',
  templateUrl: './example-root.component.html',
  styleUrls: ['./example-root.component.scss'],
  imports: [
    LuxAlphabeticallySortedPipe,
    LuxPanelHeaderTitleComponent,
    LuxPanelContentComponent,
    LuxPanelComponent,
    LuxAriaRoleDirective,
    LuxAriaLabelDirective,
    LuxButtonComponent,
    NgClass,
    RouterOutlet,
    LuxLinkPlainComponent,
    LuxBadgeNotificationDirective
]
})
export class ExampleRootComponent implements OnDestroy {
  private router = inject(Router);
  navigationService = inject(ComponentsOverviewNavigationService);
  private mediaQueryService = inject(LuxMediaQueryObserverService);

  private routerSubscription: Subscription;
  private subscription: Subscription;

  desktopView: boolean;

  @ViewChild('exampleListElement') exampleListElement!: ElementRef;

  constructor() {
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        LuxUtil.goToTop();
      }
    });

    this.desktopView = !this.mediaQueryService.isXS() && !this.mediaQueryService.isSM();

    this.subscription = this.mediaQueryService.getMediaQueryChangedAsObservable().subscribe(() => {
      this.desktopView = !this.mediaQueryService.isXS() && !this.mediaQueryService.isSM();
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    this.subscription.unsubscribe();
  }

  onPrev() {
    this.navigationService.navigateToPrevComponent();
  }

  onNext() {
    this.navigationService.navigateToNextComponent();
  }

  /**
   * Führt die Click-Funktion der Bsp-Component aus.
   * @param component
   */
  onComponentClick(component: any) {
    component.onclick();
  }

  goToElement(event: Event | null, elementId: string) {
    event?.preventDefault();
    const element = document.getElementById(elementId);
    if (element) {
      // Sicherstellen, dass das Element fokussierbar ist
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '-1');
      }
      element.focus();
    } else {
      console.warn(`Skip link target not found: #${elementId}`);
    }
  }
}
