import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HammerModule } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import {
  LuxAlphabeticallySortedPipe,
  LuxAppContentComponent,
  LuxAppFooterComponent,
  LuxAppFooterFixedService,
  LuxAppFooterLinkInfo,
  LuxAppFooterLinkService,
  LuxAppHeaderAcActionNavComponent,
  LuxAppHeaderAcActionNavItemComponent,
  LuxAppHeaderAcActionNavItemCustomComponent,
  LuxAppHeaderAcComponent,
  LuxAppHeaderAcNavMenuComponent,
  LuxAppHeaderAcNavMenuItemComponent,
  LuxAppHeaderAcUserMenuComponent,
  LuxAppHeaderActionNavComponent,
  LuxAppHeaderActionNavItemComponent,
  LuxAppHeaderActionNavItemCustomComponent,
  LuxAppHeaderComponent,
  LuxAppHeaderRightNavComponent,
  LuxAppService,
  LuxAriaLabelDirective,
  LuxButtonComponent,
  LuxConsoleService,
  LuxDividerComponent,
  LuxIconRegistryService,
  LuxLinkPlainComponent,
  LuxLookupService,
  LuxMediaQueryObserverService,
  LuxMenuComponent,
  LuxMenuItemComponent,
  LuxMenuSectionTitleComponent,
  LuxSideNavComponent,
  LuxSideNavFooterComponent,
  LuxSideNavHeaderComponent,
  LuxSideNavItemComponent,
  LuxSnackbarService,
  LuxTenantLogoComponent,
  LuxThemeService,
  LuxTooltipDirective,
  LuxAppHeaderAcSessionTimerComponent
} from '@ihk-gfi/lux-components';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { ComponentsOverviewNavigationService } from './components-overview/components-overview-navigation.service';
import { MockLuxLookupService } from './components-overview/lookup-examples/mock-lookup-service';
import { TenantLogoExampleConfigData } from './components-overview/tenant-logo-example/tenant-logo-example-config/tenant-logo-example-config-data';
import { TenantLogoExampleHeaderService } from './components-overview/tenant-logo-example/tenant-logo-example-header.service';

@Component({
  selector: 'app-root',
  imports: [
    LuxTenantLogoComponent,
    LuxAlphabeticallySortedPipe,
    LuxLinkPlainComponent,
    LuxMenuComponent,
    LuxMenuItemComponent,
    LuxButtonComponent,
    LuxAppHeaderAcActionNavItemCustomComponent,
    LuxAppHeaderAcActionNavItemComponent,
    LuxAppHeaderAcActionNavComponent,
    LuxAppHeaderAcNavMenuItemComponent,
    LuxAppHeaderActionNavItemCustomComponent,
    LuxAppHeaderAcNavMenuComponent,
    LuxAppHeaderAcUserMenuComponent,
    LuxAppHeaderAcComponent,
    LuxAppHeaderActionNavItemComponent,
    LuxAppHeaderActionNavComponent,
    LuxAppContentComponent,
    LuxSideNavItemComponent,
    LuxSideNavHeaderComponent,
    LuxSideNavFooterComponent,
    LuxSideNavComponent,
    LuxAppHeaderRightNavComponent,
    LuxAppFooterComponent,
    LuxAppHeaderComponent,
    LuxAriaLabelDirective,
    LuxTooltipDirective,
    AsyncPipe,
    HammerModule,
    CdkScrollable,
    LuxDividerComponent,
    LuxMenuSectionTitleComponent,
    TranslocoPipe,
    LuxAppHeaderAcSessionTimerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [{ provide: LuxLookupService, useClass: MockLuxLookupService }]
})
export class AppComponent implements OnInit, OnDestroy {
  router = inject(Router);
  private linkService = inject(LuxAppFooterLinkService);
  private snackbarService = inject(LuxSnackbarService);
  navigationService = inject(ComponentsOverviewNavigationService);
  private themeService = inject(LuxThemeService);
  private elementRef = inject(ElementRef);
  private appService = inject(LuxAppService);
  private mediaQueryService = inject(LuxMediaQueryObserverService);
  componentsOverviewService = inject(ComponentsOverviewNavigationService);
  tenantLogoHeaderService = inject(TenantLogoExampleHeaderService);
  fixedFooterService = inject(LuxAppFooterFixedService);
  iconService = inject(LuxIconRegistryService);
  tService = inject(TranslocoService);

  @ViewChild(LuxSideNavComponent) sideNavComp!: LuxSideNavComponent;

  @Input() luxAppHeader: 'normal' | 'minimal' | 'none' = 'normal';
  @Input() luxAppFooter: 'normal' | 'minimal' | 'none' = 'normal';
  @Input() luxMode: 'stand-alone' | 'portal' = 'stand-alone';

  mobileView: boolean;
  subscriptions: Subscription[] = [];
  window = window;
  jsonDataResult: any;
  demoUserName = 'Susanne Sonnenschein';
  demoUserEmail = 'susanne.sonnenschein@example.com';
  demoLoginBtn = 'Abmelden';
  themeName: string;
  url = '/';
  components: number;
  public tenantLogoConfig?: TenantLogoExampleConfigData;

  constructor() {
    this.themeService.loadTheme();
    this.themeName = this.themeService.getTheme().name;
    this.router.initialNavigation();
    this.appService.appEl = this.elementRef.nativeElement;
    this.iconService.getSvgIconList().push({ iconName: 'lux-components', iconBasePath: '', iconPath: 'assets/favicons/favicon.svg' });

    this.mobileView = this.mediaQueryService.isHandset();
    this.subscriptions.push(
      this.mediaQueryService.getMediaQueryChangedAsObservable().subscribe(() => {
        this.mobileView = this.mediaQueryService.isHandset();
      })
    );

    this.components = this.componentsOverviewService.filteredComponents.length;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
      }
    });

    this.subscriptions.push(
      this.tenantLogoHeaderService.tenantConfigChange.subscribe((config) => {
        this.tenantLogoConfig = config;
      })
    );

    this.tService.langChanges$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.updateFooterLinks();
    });
  }

  ngOnInit() {
    this.updateFooterLinks();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  onSideNavExpandedChange(expanded: boolean) {
    LuxConsoleService.LOG(`SideNav ${expanded ? 'opened' : 'closed'}`);
  }

  onChangeTheme(themeName: string) {
    this.themeService.setTheme(themeName);
    this.themeName = themeName;
    window.location.reload();
  }

  toggleLogin() {
    if (this.demoUserName) {
      this.demoUserName = '';
      this.demoUserEmail = '';
      this.demoLoginBtn = 'Anmelden';
    } else {
      this.demoUserName = 'Susanne Sonnenschein';
      this.demoUserEmail = 'susanne.sonnenschein@example.com';
      this.demoLoginBtn = 'Abmelden';
    }
  }

  goToHome() {
    this.router.navigate(['home']);
  }

  goToComponents() {
    this.router.navigate(['components-overview']);
  }

  goToForm() {
    this.router.navigate(['form']);
  }

  goToConfig() {
    this.router.navigate(['configuration']);
  }

  goToBaseline() {
    this.router.navigate(['baseline']);
  }
  goToIconSearch() {
    this.router.navigate(['icon-overview']);
  }

  goToHomepage() {
    window.open('https://www.ihk-gfi.de/');
  }

  goToImpressum() {
    this.sideNavComp.close();
    this.router.navigate(['impressum']);
  }

  goToLicenseHint() {
    this.sideNavComp.close();
    this.router.navigate(['license-hint']);
  }

  actionClicked(text: string, iconName?: string) {
    this.snackbarService.open(3000, {
      text,
      iconName,
      iconColor: 'orange',
      action: 'OK',
      actionColor: 'green'
    });
  }

  onModuleClicked(moduleName: string) {
    // den expanded zustand im service merken
    this.navigationService.currentModules.set(moduleName, !this.navigationService.currentModules.get(moduleName));
  }

  public onTenantLogoClicked() {
    if (this.tenantLogoConfig?.luxTenantLogoClicked) {
      this.tenantLogoConfig.luxTenantLogoClicked();
    }
  }

  private updateFooterLinks() {
    this.linkService.linkInfos = [
      new LuxAppFooterLinkInfo(this.tService.translate('app.footer.link.dataProtection'), 'datenschutz', true),
      new LuxAppFooterLinkInfo(this.tService.translate('app.footer.link.impressum'), 'impressum'),
      new LuxAppFooterLinkInfo(this.tService.translate('app.footer.link.licenseHint'), 'license-hint')
    ];
  }

  loginUser() {
    console.log('Session Timer: Login User');
    this.router.navigate(['/']);
  }

  logoutUser() {
    console.log('Session Timer: Logout User');
  }
}
