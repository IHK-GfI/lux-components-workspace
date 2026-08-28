import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  viewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxMenuItemComponent } from '../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxMenuTriggerComponent } from '../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-trigger.component';
import { LuxMenuComponent } from '../../lux-action/lux-menu/lux-menu.component';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaRoleDirective } from '../../lux-directives/lux-aria/lux-aria-role.directive';
import { LuxTooltipDirective } from '../../lux-directives/lux-tooltip/lux-tooltip.directive';
import { LuxTenantLogoComponent } from '../../lux-tenant-logo/lux-tenant-logo.component';
import { LuxAppService } from '../../lux-util/lux-app.service';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxAppHeaderAcActionNavComponent } from './lux-app-header-ac-subcomponents/lux-app-header-ac-action-nav/lux-app-header-ac-action-nav.component';
import { LuxAppHeaderAcNavMenuComponent } from './lux-app-header-ac-subcomponents/lux-app-header-ac-nav-menu/lux-app-header-ac-nav-menu.component';
import { LuxAppHeaderAcUserMenuComponent } from './lux-app-header-ac-subcomponents/lux-app-header-ac-user-menu.component';
import { LuxLangSelectAcComponent } from './lux-app-header-ac-subcomponents/lux-lang-select-ac/lux-lang-select-ac.component';

import { TranslocoPipe } from '@jsverse/transloco';
import { LuxMenuPanelHeaderComponent } from '../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-panel-header.component';
import { LuxMenuSectionTitleComponent } from '../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-section-title.component';
import { LuxImageComponent } from '../../lux-icon/lux-image/lux-image.component';
import { LuxDividerComponent } from '../lux-divider/lux-divider.component';

@Component({
  selector: 'lux-app-header-ac',
  templateUrl: './lux-app-header-ac.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxAriaRoleDirective,
    LuxAriaLabelDirective,
    NgClass,
    NgStyle,
    NgTemplateOutlet,
    LuxLangSelectAcComponent,
    LuxTooltipDirective,
    LuxMenuItemComponent,
    LuxMenuTriggerComponent,
    LuxButtonComponent,
    LuxMenuComponent,
    LuxImageComponent,
    LuxMenuPanelHeaderComponent,
    LuxDividerComponent,
    LuxMenuSectionTitleComponent,
    TranslocoPipe
  ]
})
export class LuxAppHeaderAcComponent implements OnInit {
  private logger = inject(LuxConsoleService);
  private queryService = inject(LuxMediaQueryObserverService);
  private elementRef = inject(ElementRef);
  private appService = inject(LuxAppService);
  private configService = inject(LuxComponentsConfigService);
  private cdr = inject(ChangeDetectorRef);

  readonly luxUserName = input<string | undefined>();
  readonly luxUserEmail = input<string | undefined>();
  readonly luxAppTitle = input<string | undefined>();
  readonly luxAppTitleShort = input<string | undefined>();
  readonly luxBrandLogoSrc = input<string | undefined>();
  readonly luxHideBrandLogo = input(false);
  readonly luxAppLogoSrc = input<string | undefined>();
  readonly luxHideAppLogo = input(false);
  readonly luxLocaleSupported = input(['de']);
  readonly luxLocaleBaseHref = input('');
  readonly luxHideTopBar = input(false);
  readonly luxHideNavBar = input(false);
  readonly luxAriaRoleHeaderLabel = input('');
  readonly luxAriaUserMenuButtonLabel = input('');
  readonly luxAriaTitleIconLabel = input('');
  readonly luxAriaTitleImageLabel = input('');
  readonly luxCenteredView = input<boolean | undefined>();
  readonly luxCenteredWidth = input<string | undefined>();

  readonly luxAppLogoClicked = output<Event>();
  readonly luxBrandLogoClicked = output<Event>();

  readonly customTrigger = viewChild('customTrigger', { read: ElementRef });

  readonly tenantLogo = contentChild(LuxTenantLogoComponent);
  readonly navMenu = contentChild(LuxAppHeaderAcNavMenuComponent);
  readonly userMenu = contentChild(LuxAppHeaderAcUserMenuComponent);
  readonly actionNav = contentChild(LuxAppHeaderAcActionNavComponent);

  userNameShort?: string;

  mobileView: boolean;
  subscriptions: Subscription[] = [];

  menuOpened = false;

  private iconBasePath = '';

  readonly effectiveAppLogoSrc = computed(() => {
    if (this.luxHideAppLogo()) {
      return undefined;
    }
    return this.luxAppLogoSrc() ?? this.iconBasePath + '/assets/logos/app_logo_platzhalter.svg';
  });

  readonly effectiveBrandLogoSrc = computed(() => {
    if (this.luxHideBrandLogo()) {
      return undefined;
    }
    return this.luxBrandLogoSrc() ?? this.iconBasePath + '/assets/logos/ihk_logo_platzhalter.svg';
  });

  readonly effectiveCenteredView = computed(
    () =>
      this.luxCenteredView() ??
      (this.configService.currentConfig.viewConfiguration?.centeredView
        ? this.configService.currentConfig.viewConfiguration.centeredView
        : LuxComponentsConfigService.DEFAULT_CONFIG.viewConfiguration.centeredView)
  );

  readonly effectiveCenteredWidth = computed(
    () =>
      this.luxCenteredWidth() ??
      (this.configService.currentConfig.viewConfiguration?.centeredWidth
        ? this.configService.currentConfig.viewConfiguration.centeredWidth
        : LuxComponentsConfigService.DEFAULT_CONFIG.viewConfiguration.centeredWidth)
  );

  constructor() {
    this.mobileView = this.queryService.activeMediaQuery === 'xs' || this.queryService.activeMediaQuery === 'sm';
    this.subscriptions.push(
      this.queryService.getMediaQueryChangedAsObservable().subscribe((query) => {
        this.mobileView = query === 'xs' || query === 'sm';
        this.cdr.markForCheck();
      })
    );
    this.appService.appHeaderEl = this.elementRef.nativeElement;
    this.iconBasePath = this.configService.currentConfig.iconBasePath ?? '';
    if (this.iconBasePath.endsWith('/')) {
      this.iconBasePath = this.iconBasePath.substring(0, this.iconBasePath.length - 1);
    }
  }

  ngOnInit(): void {
    if (!this.luxAppTitleShort() || this.luxAppTitleShort()!.length === 0) {
      this.logger.warn('No title is set for the mobile view.');
    }
  }

  onMenuOpened() {
    this.menuOpened = true;
  }

  onMenuClosed() {
    this.menuOpened = false;
    const customTrigger = this.customTrigger();
    if (customTrigger) {
      customTrigger.nativeElement.children[0].focus();
    }
  }

  onAppLogoClicked(event: any) {
    this.luxAppLogoClicked.emit(event);
  }

  onBrandLogoClicked(event: any) {
    this.luxBrandLogoClicked.emit(event);
  }

  isItemDivider(menuItem: any): menuItem is LuxDividerComponent {
    return menuItem instanceof LuxDividerComponent;
  }

  isItemMenuItem(menuItem: any): menuItem is LuxMenuItemComponent {
    return menuItem instanceof LuxMenuItemComponent;
  }

  isSectionTitle(menuItem: any): menuItem is LuxMenuSectionTitleComponent {
    return menuItem instanceof LuxMenuSectionTitleComponent;
  }
}
