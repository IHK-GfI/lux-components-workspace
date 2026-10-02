import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxComponentsConfigService } from '../lux-components-config/lux-components-config.service';
import { LuxAriaLabelDirective } from '../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxImageComponent } from '../lux-icon/lux-image/lux-image.component';
import { LuxMediaQueryObserverService } from '../lux-util/lux-media-query-observer.service';

@Component({
  selector: 'lux-tenant-logo',
  templateUrl: './lux-tenant-logo.component.html',
  styleUrls: ['./lux-tenant-logo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxImageComponent, LuxAriaLabelDirective, TranslocoPipe]
})
export class LuxTenantLogoComponent {
  /*
   * Statische Methoden, die beschreiben, wie (z.B.) die Url aufgebaut wird und sich diese je nach Media Query verändert
   * Kann eventuell durch konfigurierbare Breakpoints ersetzt werden in der Zukunft.
   */

  public static buildTenantLogoUrlFromMediaQuery(
    baseUrl: string,
    tenantKey: string,
    tenantVariant: string | undefined,
    mediaQuery: string
  ): string {
    const actualTenantVariant = tenantVariant || LuxTenantLogoComponent.getVariantByMediaQuery(mediaQuery);
    return LuxTenantLogoComponent.buildTenantLogoUrl(baseUrl, tenantKey, actualTenantVariant);
  }

  public static getVariantByMediaQuery(mediaQuery: string): string {
    if (mediaQuery === 'xs' || mediaQuery === 'sm') {
      return 'kurz';
    } else {
      return 'lang';
    }
  }

  public static buildTenantLogoUrl(baseUrl: string, tenantKey: string, tenantVariant: string): string {
    return baseUrl + tenantKey + '_' + tenantVariant + '.svg';
  }

  readonly luxTenantKey = input.required<string>();
  readonly luxTenantVariant = input<string | undefined>(undefined);
  readonly luxTenantLogoHeight = input<string>('');

  readonly luxTenantLogoClicked = output<Event>();

  private readonly componentsConfigService = inject(LuxComponentsConfigService);
  private readonly queryObserver = inject(LuxMediaQueryObserverService);
  private readonly config = toSignal(this.componentsConfigService.config, { initialValue: this.componentsConfigService.currentConfig });
  private readonly mediaQuery = toSignal(this.queryObserver.getMediaQueryChangedAsObservable(), {
    initialValue: this.queryObserver.activeMediaQuery
  });

  /** Zählt Ladefehler pro angefragter Logo-Identität (apiPath/Key/Variant) - wird bei neuer Identität implizit ignoriert, siehe currentAttempt(). */
  private readonly errorState = signal<{ key: string; attempt: number } | undefined>(undefined);

  private readonly apiPath = computed(
    () => this.config().tenantLogoLookupServiceUrl ?? LuxComponentsConfigService.DEFAULT_CONFIG.tenantLogoLookupServiceUrl
  );

  private readonly resolvedVariant = computed(() => {
    const mediaQuery = this.mediaQuery();
    if (!mediaQuery) return undefined;
    return this.luxTenantVariant() || LuxTenantLogoComponent.getVariantByMediaQuery(mediaQuery);
  });

  private readonly identityKey = computed(() => {
    const apiPath = this.apiPath();
    const variant = this.resolvedVariant();
    if (!apiPath || !variant) return undefined;
    return `${apiPath}|${this.luxTenantKey()}|${variant}`;
  });

  private readonly currentAttempt = computed(() => {
    const key = this.identityKey();
    const state = this.errorState();
    return key && state?.key === key ? state.attempt : 0;
  });

  protected readonly hasTriedFallback = computed(() => this.currentAttempt() >= 1 && this.resolvedVariant() !== 'kurz');
  protected readonly imageLoadError = computed(() => {
    const attempt = this.currentAttempt();
    return attempt >= 2 || (attempt >= 1 && this.resolvedVariant() === 'kurz');
  });

  protected readonly tenantLogoSrc = computed(() => {
    const apiPath = this.apiPath();
    if (!apiPath || !this.mediaQuery() || this.imageLoadError()) return undefined;

    const tenantKey = this.luxTenantKey();
    if (this.hasTriedFallback()) {
      return LuxTenantLogoComponent.buildTenantLogoUrl(apiPath, tenantKey, 'kurz');
    }
    return LuxTenantLogoComponent.buildTenantLogoUrlFromMediaQuery(apiPath, tenantKey, this.luxTenantVariant(), this.mediaQuery()!);
  });

  protected readonly actualLuxTenantLogoHeight = computed(() => {
    const height = this.luxTenantLogoHeight();
    if (height) return height;

    const mediaQuery = this.mediaQuery();
    if (!mediaQuery) return '';
    return mediaQuery === 'xs' || mediaQuery === 'sm' ? '32px' : '40px';
  });

  protected readonly luxTenantLogoAriaLabel = computed(() => 'Logo ' + this.luxTenantKey());
  protected readonly luxTenantLogoAlt = computed(() => 'Logo ' + this.luxTenantKey());

  public onImageClicked(event: any): void {
    this.luxTenantLogoClicked.emit(event);
  }

  protected onImageError(): void {
    const key = this.identityKey();
    if (!key) return;

    this.errorState.update((state) => ({ key, attempt: (state?.key === key ? state.attempt : 0) + 1 }));
  }
}
