import { Component, OnDestroy, OnInit, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  LuxComponentsConfigParameters,
  LuxComponentsConfigService,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxMediaQueryObserverService,
  LuxSelectComponent,
  LuxTenantLogoComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { TenantLogoExampleConfigData } from './tenant-logo-example-config-data';

interface TenantLogoExampleKey {
  label: string;
  value: string;
}

@Component({
  selector: 'app-tenant-logo-example-config',
  templateUrl: './tenant-logo-example-config.component.html',
  styleUrls: ['./tenant-logo-example-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxToggleComponent, LuxSelectComponent, LuxInputComponent, LuxFormHintComponent]
})
export class TenantLogoExampleConfigComponent implements OnInit, OnDestroy {
  readonly title = input.required<string>();

  readonly tenantLogoConfig = input.required<TenantLogoExampleConfigData>();

  pickValueKeyFn = (option: TenantLogoExampleKey) => option.value;

  public tenantKeyArr: TenantLogoExampleKey[] = [
    { label: '100', value: '100' },
    { label: '101 (nicht verfügbar)', value: '101' },
    { label: '202', value: '202' },
    { label: '341 (Variante "unten" nicht verfügbar - Fallback auf "kurz")', value: '341' }
  ];

  public tenantVariantArr: string[] = ['', 'lang', 'kurz', 'unten'];

  readonly apiPath = signal('');

  private componentsConfigService = inject(LuxComponentsConfigService);
  private queryObserver = inject(LuxMediaQueryObserverService);
  private readonly mediaQuery = signal<string | undefined>(undefined);
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(
      this.componentsConfigService.config.subscribe((newConfig: LuxComponentsConfigParameters) => {
        this.apiPath.set(newConfig.tenantLogoLookupServiceUrl ?? LuxComponentsConfigService.DEFAULT_CONFIG.tenantLogoLookupServiceUrl);
      })
    );

    this.subscriptions.push(
      this.queryObserver.getMediaQueryChangedAsObservable().subscribe((mediaQuery: string) => {
        this.mediaQuery.set(mediaQuery);
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
      this.tenantLogoConfig().luxTenantLogoClicked = () => {
        console.log('Logo [' + this.tenantLogoConfig().luxTenantKey + '_' + this.actualTenantVariant + '] clicked!');
      };
    } else {
      this.tenantLogoConfig().luxTenantLogoClicked = () => {
        /* Do nothing */
      };
    }
  }

  public get actualTenantVariant(): string {
    const mediaQuery = this.mediaQuery();
    if (!mediaQuery) return '';

    return this.tenantLogoConfig().luxTenantVariant || LuxTenantLogoComponent.getVariantByMediaQuery(mediaQuery);
  }

  public get logoTenantSrc(): string | undefined {
    if (!this.apiPath()) return;
    if (!this.mediaQuery()) return;

    return LuxTenantLogoComponent.buildTenantLogoUrl(this.apiPath(), this.tenantLogoConfig().luxTenantKey, this.actualTenantVariant);
  }
}
