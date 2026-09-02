import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, inject, input, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import {
  LUX_CONSENT_CONFIG,
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
  LuxAppHeaderAcSessionTimerComponent,
  LuxAppHeaderAcUserMenuComponent,
  LuxAppHeaderActionNavComponent,
  LuxAppHeaderActionNavItemComponent,
  LuxAppHeaderActionNavItemCustomComponent,
  LuxAppHeaderComponent,
  LuxAppHeaderRightNavComponent,
  LuxAppService,
  LuxAriaLabelDirective,
  LuxButtonComponent,
  LuxConsentPurpose,
  LuxConsentService,
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
  LuxTooltipDirective
} from '@ihk-gfi/lux-components';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { filter, map, startWith } from 'rxjs';
import { ComponentsOverviewNavigationService } from './components-overview/components-overview-navigation.service';
import { MockLuxLookupService } from './components-overview/lookup-examples/mock-lookup-service';
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
    CdkScrollable,
    LuxDividerComponent,
    LuxMenuSectionTitleComponent,
    TranslocoPipe,
    LuxAppHeaderAcSessionTimerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: LuxLookupService, useClass: MockLuxLookupService }]
})
export class AppComponent implements OnInit {
  router = inject(Router);
  private linkService = inject(LuxAppFooterLinkService);
  private snackbarService = inject(LuxSnackbarService);
  navigationService = inject(ComponentsOverviewNavigationService);
  private themeService = inject(LuxThemeService);
  private elementRef = inject(ElementRef);
  private appService = inject(LuxAppService);
  private mediaQueryService = inject(LuxMediaQueryObserverService);
  private readonly consentConfig = inject(LUX_CONSENT_CONFIG);
  private consentService = inject(LuxConsentService);
  componentsOverviewService = inject(ComponentsOverviewNavigationService);
  tenantLogoHeaderService = inject(TenantLogoExampleHeaderService);
  fixedFooterService = inject(LuxAppFooterFixedService);
  iconService = inject(LuxIconRegistryService);
  tService = inject(TranslocoService);

  readonly sideNavComp = viewChild(LuxSideNavComponent);

  readonly luxAppHeader = input<'normal' | 'minimal' | 'none'>('normal');
  readonly luxAppFooter = input<'normal' | 'minimal' | 'none'>('normal');
  readonly luxMode = input<'stand-alone' | 'portal'>('stand-alone');

  window = window;
  jsonDataResult: any;
  readonly demoUserName = signal('Susanne Sonnenschein');
  readonly demoUserEmail = signal('susanne.sonnenschein@example.com');
  readonly demoLoginBtn = signal('Abmelden');
  readonly themeName = signal(this.themeService.getTheme().name);
  readonly mobileView = toSignal(
    this.mediaQueryService.getMediaQueryChangedAsObservable().pipe(
      map(() => this.mediaQueryService.isHandset()),
      startWith(this.mediaQueryService.isHandset())
    ),
    { initialValue: this.mediaQueryService.isHandset() }
  );
  readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.url)
    ),
    { initialValue: this.router.url }
  );
  readonly components = this.componentsOverviewService.filteredComponents.length;
  readonly tenantLogoConfig = toSignal(this.tenantLogoHeaderService.tenantConfigChange, { initialValue: undefined });

  constructor() {
    this.themeService.loadTheme();
    this.themeName.set(this.themeService.getTheme().name);
    this.router.initialNavigation();
    this.appService.appEl = this.elementRef.nativeElement;
    this.iconService.getSvgIconList().push({ iconName: 'lux-components', iconBasePath: '', iconPath: 'assets/favicons/favicon.svg' });

    this.tService.langChanges$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.updateFooterLinks();
    });
  }

  ngOnInit() {
    this.updateFooterLinks();

    this.consentService.openIfNeeded();
  }

  onSideNavExpandedChange(expanded: boolean) {
    LuxConsoleService.LOG(`SideNav ${expanded ? 'opened' : 'closed'}`);
  }

  onChangeTheme(themeName: string) {
    this.themeService.setTheme(themeName);
    this.themeName.set(themeName);
    window.location.reload();
  }

  toggleLogin() {
    if (this.demoUserName()) {
      this.demoUserName.set('');
      this.demoUserEmail.set('');
      this.demoLoginBtn.set('Anmelden');
      this.consentService.clearSessionConsent();
    } else {
      this.demoUserName.set('Susanne Sonnenschein');
      this.demoUserEmail.set('susanne.sonnenschein@example.com');
      this.demoLoginBtn.set('Abmelden');
    }
  }

  onOpenConsent() {
    this.consentService.open();
  }

  hasNonEssentialEntries(): boolean {
    return !!this.consentConfig.entries && this.consentConfig.entries.some((entry) => entry.purpose !== LuxConsentPurpose.Essential);
  }

  goToHome() {
    this.router.navigate(['home']);
  }

  goToDeepWiki() {
    window.open('https://deepwiki.com/IHK-GfI/lux-components-workspace', '_blank', 'noopener,noreferrer');
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
    this.sideNavComp()?.close();
    this.router.navigate(['impressum']);
  }

  goToLicenseHint() {
    this.sideNavComp()?.close();
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
    const tenantLogoConfig = this.tenantLogoConfig();
    if (tenantLogoConfig?.luxTenantLogoClicked) {
      tenantLogoConfig.luxTenantLogoClicked();
    }
  }

  private updateFooterLinks() {
    this.linkService.linkInfos = [
      new LuxAppFooterLinkInfo(this.tService.translate('app.footer.link.dataProtection'), 'datenschutz', true),
      new LuxAppFooterLinkInfo(this.tService.translate('app.footer.link.impressum'), 'impressum'),
      new LuxAppFooterLinkInfo(this.tService.translate('app.footer.link.licenseHint'), 'license-hint'),
      new LuxAppFooterLinkInfo(this.tService.translate('app.footer.link.consent'), '', true, false, () => this.onOpenConsent())
    ];
  }

  timeout() {
    console.log('Timeout Event wurde vom LuxAppHeaderAcSessionTimerService ausgelöst');
    this.snackbarService.open(4000, {
      text: 'Timeout wurde ausgelöst'
    });
  }

  logoutUser() {
    console.log('Logout Event wurde vom LuxAppHeaderAcSessionTimerService ausgelöst');
    this.snackbarService.open(4000, {
      text: 'Logout wurde ausgelöst'
    });
  }
}
