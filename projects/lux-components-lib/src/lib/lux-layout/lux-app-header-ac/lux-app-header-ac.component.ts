import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  inject
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
import { LuxImageComponent } from '../../lux-icon/lux-image/lux-image.component';

@Component({
  selector: 'lux-app-header-ac',
  templateUrl: './lux-app-header-ac.component.html',
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
    TranslocoPipe
  ]
})
export class LuxAppHeaderAcComponent implements OnInit, OnChanges {
  private logger = inject(LuxConsoleService);
  private queryService = inject(LuxMediaQueryObserverService);
  private elementRef = inject(ElementRef);
  private appService = inject(LuxAppService);
  private configService = inject(LuxComponentsConfigService);

  @Input() luxUserName?: string;
  @Input() luxAppTitle?: string;
  @Input() luxAppTitleShort?: string;
  @Input() luxBrandLogoSrc?: string;
  @Input() luxHideBrandLogo = false;
  @Input() luxAppLogoSrc?: string;
  @Input() luxHideAppLogo = false;
  @Input() luxLocaleSupported = ['de'];
  @Input() luxLocaleBaseHref = '';
  @Input() luxHideTopBar = false;
  @Input() luxHideNavBar = false;
  @Input() luxAriaRoleHeaderLabel = '';
  @Input() luxAriaUserMenuButtonLabel = '';
  @Input() luxAriaTitleIconLabel = '';
  @Input() luxAriaTitleImageLabel = '';
  @Input() luxCenteredView!: boolean;
  @Input() luxCenteredWidth!: string;

  @Output() luxAppLogoClicked = new EventEmitter<Event>();
  @Output() luxBrandLogoClicked = new EventEmitter<Event>();

  @ViewChild('customTrigger', { read: ElementRef }) customTrigger?: ElementRef;

  @ContentChild(LuxTenantLogoComponent) tenantLogo?: LuxTenantLogoComponent;
  @ContentChild(LuxAppHeaderAcNavMenuComponent) navMenu?: LuxAppHeaderAcNavMenuComponent;
  @ContentChild(LuxAppHeaderAcUserMenuComponent) userMenu?: LuxAppHeaderAcUserMenuComponent;
  @ContentChild(LuxAppHeaderAcActionNavComponent) actionNav?: LuxAppHeaderAcActionNavComponent;

  userNameShort?: string;

  mobileView: boolean;
  subscriptions: Subscription[] = [];

  menuOpened = false;

  private iconBasePath = '';

  constructor() {
    this.mobileView = this.queryService.activeMediaQuery === 'xs' || this.queryService.activeMediaQuery === 'sm';
    this.subscriptions.push(
      this.queryService.getMediaQueryChangedAsObservable().subscribe((query) => {
        this.mobileView = query === 'xs' || query === 'sm';
      })
    );
    this.appService.appHeaderEl = this.elementRef.nativeElement;
    this.iconBasePath = this.configService.currentConfig.iconBasePath ?? '';
    if (this.iconBasePath.endsWith('/')) {
      this.iconBasePath = this.iconBasePath.substring(0, this.iconBasePath.length - 1);
    }
  }

  ngOnInit(): void {
    if (!this.luxAppLogoSrc && !this.luxHideAppLogo) {
      this.luxAppLogoSrc = this.iconBasePath + '/assets/logos/app_logo_platzhalter.svg';
    }

    if (this.luxHideAppLogo) {
      this.luxAppLogoSrc = undefined;
    }

    if (!this.luxBrandLogoSrc && !this.luxHideBrandLogo) {
      this.luxBrandLogoSrc = this.iconBasePath + '/assets/logos/ihk_logo_platzhalter.svg';
    }

    if (this.luxHideBrandLogo) {
      this.luxBrandLogoSrc = undefined;
    }

    if (!this.luxCenteredView) {
      this.luxCenteredView = this.configService.currentConfig.viewConfiguration?.centeredView
        ? this.configService.currentConfig.viewConfiguration.centeredView
        : LuxComponentsConfigService.DEFAULT_CONFIG.viewConfiguration.centeredView;
    }

    if (!this.luxCenteredWidth) {
      this.luxCenteredWidth = this.configService.currentConfig.viewConfiguration?.centeredWidth
        ? this.configService.currentConfig.viewConfiguration.centeredWidth
        : LuxComponentsConfigService.DEFAULT_CONFIG.viewConfiguration.centeredWidth;
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (!this.luxAppTitleShort || this.luxAppTitleShort.length === 0) {
      this.logger.warn('No title is set for the mobile view.');
    }
  }

  onMenuOpened() {
    this.menuOpened = true;
  }

  onMenuClosed() {
    this.menuOpened = false;
    if (this.customTrigger) {
      this.customTrigger.nativeElement.children[0].focus();
    }
  }

  onAppLogoClicked(event: any) {
    this.luxAppLogoClicked.emit(event);
  }

  onBrandLogoClicked(event: any) {
    this.luxBrandLogoClicked.emit(event);
  }
}
