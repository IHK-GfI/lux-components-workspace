import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  LuxComponentsConfigParameters,
  LuxComponentsConfigService,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxMediaQueryObserverService,
  LuxSelectAcComponent,
  LuxTenantLogoComponent,
  LuxToggleAcComponent
} from 'lux-components-lib';
import { Subscription } from 'rxjs';
import { TenantLogoExampleConfigData } from './tenant-logo-example-config-data';

@Component({
  selector: 'app-tenant-logo-example-config',
  templateUrl: './tenant-logo-example-config.component.html',
  styleUrls: ['./tenant-logo-example-config.component.scss'],
  imports: [LuxToggleAcComponent, LuxSelectAcComponent, LuxInputAcComponent, LuxFormHintComponent]
})
export class TenantLogoExampleConfigComponent implements OnInit, OnDestroy {
  private componentsConfigService = inject(LuxComponentsConfigService);
  private queryObserver = inject(LuxMediaQueryObserverService);

  @Input()
  public title!: string;

  @Input()
  public tenantLogoConfig!: TenantLogoExampleConfigData;

  public tenantKeyArr: string[] = ['100', '202', '341'];

  public tenantVariantArr: string[] = ['', 'lang', 'kurz', 'unten'];

  public apiPath = '';
  public actualTenantVariant?: string = '';
  private mediaQuery?: string;

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(
      this.componentsConfigService.config.subscribe((newConfig: LuxComponentsConfigParameters) => {
        this.apiPath = newConfig.tenantLogoLookupServiceUrl ?? LuxComponentsConfigService.DEFAULT_CONFIG.tenantLogoLookupServiceUrl;
      })
    );

    this.subscriptions.push(
      this.queryObserver.getMediaQueryChangedAsObservable().subscribe((mediaQuery: string) => {
        this.mediaQuery = mediaQuery;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  public onShowLogoClickedEvents(toggle: boolean) {
    if (toggle) {
      this.tenantLogoConfig.luxTenantLogoClicked = () => {
        console.log('Logo [' + this.tenantLogoConfig.luxTenantKey + '_' + this.actualTenantVariant + '] clicked!');
      };
    } else {
      this.tenantLogoConfig.luxTenantLogoClicked = () => {
        /* Do nothing */
      };
    }
  }

  public get logoTenantSrc(): string | undefined {
    if (!this.apiPath) return;
    if (!this.mediaQuery) return;

    this.actualTenantVariant = this.tenantLogoConfig.luxTenantVariant || LuxTenantLogoComponent.getVariantByMediaQuery(this.mediaQuery);
    return LuxTenantLogoComponent.buildTenantLogoUrl(this.apiPath, this.tenantLogoConfig.luxTenantKey, this.actualTenantVariant);
  }
}
