import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {
  LuxAlphabeticallySortedPipe,
  LuxAriaLabelDirective,
  LuxAriaRoleDirective,
  LuxButtonComponent,
  LuxLinkPlainComponent,
  LuxMediaQueryObserverService,
  LuxPanelComponent,
  LuxPanelContentComponent,
  LuxPanelHeaderTitleComponent,
  LuxUtil
} from '@ihk-gfi/lux-components';
import { StatusMarkerComponent } from '../../base/status-marker/status-marker.component';
import { ComponentsOverviewNavigationService } from '../../components-overview/components-overview-navigation.service';

@Component({
  selector: 'example-root',
  templateUrl: './example-root.component.html',
  styleUrls: ['./example-root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    StatusMarkerComponent
  ]
})
export class ExampleRootComponent {
  navigationService = inject(ComponentsOverviewNavigationService);

  readonly desktopView = signal(false);

  private router = inject(Router);
  private mediaQueryService = inject(LuxMediaQueryObserverService);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event: unknown) => {
      if (event instanceof NavigationEnd) {
        LuxUtil.goToTop();
      }
    });

    this.desktopView.set(!this.mediaQueryService.isXS() && !this.mediaQueryService.isSM());

    this.mediaQueryService
      .getMediaQueryChangedAsObservable()
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.desktopView.set(!this.mediaQueryService.isXS() && !this.mediaQueryService.isSM()));
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
