import { Injectable, InjectionToken, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { isTestEnv } from '../lux-util/env-utils';
import { ILuxConsentConfig } from './lux-consent-config.interface';
import { LUX_CONSENT_DIALOG_LAUNCHER } from './lux-consent-dialog-launcher';
import LUX_CONSENT_ENTRIES from './lux-consent-entries';
import { LuxConsentEntry, LuxConsentPurpose, LuxConsentState } from './lux-consent.model';

const LUX_CONSENT_COOKIE_DEFAULT_KEY = 'lux-app-consent';
const LUX_CONSENT_COOKIE_DEFAULT_DURATION_DAYS = 365;

export const LUX_CONSENT_CONFIG = new InjectionToken<ILuxConsentConfig>('LUX_CONSENT_CONFIG', {
  providedIn: 'root',
  factory: (): ILuxConsentConfig => ({
    cookieKey: LUX_CONSENT_COOKIE_DEFAULT_KEY,
    consentCookieDurationDays: LUX_CONSENT_COOKIE_DEFAULT_DURATION_DAYS
  })
});

@Injectable({
  providedIn: 'root'
})
export class LuxConsentService {
  private readonly cookieService = inject(CookieService);
  private readonly dialogLauncher = inject(LUX_CONSENT_DIALOG_LAUNCHER);
  private readonly consentConfig = inject(LUX_CONSENT_CONFIG);
  private consentState$ = new BehaviorSubject<LuxConsentState | null>(null);
  private runtimeConfigOverride?: Partial<ILuxConsentConfig>;

  constructor() {
    this.loadConsent();
  }

  getCurrentConfig(): ILuxConsentConfig {
    return this.resolveConfig();
  }

  open(configOverride?: Partial<ILuxConsentConfig>): void {
    this.runtimeConfigOverride = configOverride;
    const config = this.resolveConfig();
    this.dialogLauncher.open(
      () => {
        this.onCloseDialog(config);
        this.runtimeConfigOverride = undefined;
        if (configOverride) {
          this.loadConsent();
        }
      },
      (error) => {
        console.error('Konnte den Consent-Dialog nicht öffnen.', error);
        this.runtimeConfigOverride = undefined;
        if (configOverride) {
          this.loadConsent();
        }
      }
    );
  }

  openIfNeeded(configOverride?: Partial<ILuxConsentConfig>): void {
    this.loadConsent(configOverride);

    const shouldShow = this.shouldShowDialog(configOverride);
    if (shouldShow) {
      this.open(configOverride);
      return;
    }

    if (configOverride) {
      this.loadConsent();
    }
  }

  getConsentState(): Observable<LuxConsentState | null> {
    return this.consentState$.asObservable();
  }

  hasConsent(purpose: LuxConsentPurpose): boolean {
    const state = this.consentState$.value;
    return !!state && Array.isArray(state.purposes) ? state.purposes.includes(purpose) : false;
  }

  /**
   * Prüft, ob der Consent-Dialog angezeigt werden soll.
   * Der Dialog wird angezeigt, wenn mindestens ein nicht-funktionaler Eintrag konfiguriert ist
   * und weder ein Consent-Cookie noch ein temporärer Session-Storage-Eintrag vorhanden ist.
   */
  shouldShowDialog(configOverride?: Partial<ILuxConsentConfig>): boolean {
    if (!this.hasNonEssentialEntries(configOverride)) {
      return false;
    }

    const config = this.resolveConfig(configOverride);
    if (sessionStorage.getItem(config.cookieKey)) {
      return false;
    }
    return !this.cookieService.check(config.cookieKey);
  }

  acceptAll(configOverride?: Partial<ILuxConsentConfig>): void {
    this.saveConsent(this.getAcceptedPurposesForAcceptAll(configOverride), configOverride);
  }

  declineNonFunctional(configOverride?: Partial<ILuxConsentConfig>): void {
    this.saveConsent([LuxConsentPurpose.Essential], configOverride);
  }

  saveCustomConsent(purposes: LuxConsentPurpose[], configOverride?: Partial<ILuxConsentConfig>): void {
    const withFunctional = purposes.includes(LuxConsentPurpose.Essential) ? purposes : [LuxConsentPurpose.Essential, ...purposes];

    this.saveConsent(withFunctional, configOverride);
  }

  onCloseDialog(configOverride?: Partial<ILuxConsentConfig>): void {
    const config = this.resolveConfig(configOverride);
    // Cookie bereits gesetzt
    if (this.cookieService.check(config.cookieKey)) {
      return;
    }

    // Kein Cookie gesetzt, nur Session Storage mit funktionaler Einwilligung setzen
    const state: LuxConsentState = {
      purposes: [LuxConsentPurpose.Essential],
      timestamp: new Date().toISOString()
    };
    const stateJson = JSON.stringify(state);
    sessionStorage.setItem(config.cookieKey, stateJson);
    this.consentState$.next(state);
  }

  clearConsent(configOverride?: Partial<ILuxConsentConfig>): void {
    const config = this.resolveConfig(configOverride);
    this.cookieService.delete(config.cookieKey, '/');
    sessionStorage.removeItem(config.cookieKey);
    this.consentState$.next(null);
  }

  clearSessionConsent(configOverride?: Partial<ILuxConsentConfig>): void {
    const config = this.resolveConfig(configOverride);
    sessionStorage.removeItem(config.cookieKey);
    if (!this.cookieService.check(config.cookieKey)) {
      this.consentState$.next(null);
    }
  }

  private saveConsent(purposes: LuxConsentPurpose[], configOverride?: Partial<ILuxConsentConfig>): void {
    if (!this.hasNonEssentialEntries(configOverride)) {
      return;
    }

    const config = this.resolveConfig(configOverride);
    const state: LuxConsentState = {
      purposes,
      timestamp: new Date().toISOString()
    };

    const stateJson = JSON.stringify(state);

    this.cookieService.set(config.cookieKey, stateJson, config.consentCookieDurationDays, '/', undefined, false, 'Lax');

    // Session-Storage Einwilligung entfernen, da Cookie gesetzt wurde
    sessionStorage.removeItem(config.cookieKey);
    this.consentState$.next(state);
  }

  private getAcceptedPurposesForAcceptAll(configOverride?: Partial<ILuxConsentConfig>): LuxConsentPurpose[] {
    const config = this.resolveConfig(configOverride);
    const configuredEntries: LuxConsentEntry[] = [...LUX_CONSENT_ENTRIES, ...(config.entries ?? [])];
    const acceptedPurposes = new Set(configuredEntries.map((entry) => entry.purpose));
    acceptedPurposes.add(LuxConsentPurpose.Essential);

    return Object.values(LuxConsentPurpose).filter((purpose) => acceptedPurposes.has(purpose));
  }

  private hasNonEssentialEntries(configOverride?: Partial<ILuxConsentConfig>): boolean {
    const config = this.resolveConfig(configOverride);
    const configuredEntries: LuxConsentEntry[] = [...LUX_CONSENT_ENTRIES, ...(config.entries ?? [])];

    return configuredEntries.some((entry) => entry.purpose !== LuxConsentPurpose.Essential);
  }

  private loadConsent(configOverride?: Partial<ILuxConsentConfig>): void {
    const config = this.resolveConfig(configOverride);

    if (!configOverride && config.cookieKey === LUX_CONSENT_COOKIE_DEFAULT_KEY && !isTestEnv()) {
      console.warn(
        `Der Standard-cookieKey "${LUX_CONSENT_COOKIE_DEFAULT_KEY}" wird verwendet. Bitte geben Sie einen individuellen cookieKey in der Consent-Konfiguration an, um Konflikte mit anderen LUX-Anwendungen zu vermeiden!!!`
      );
    }

    let cookieValue = this.cookieService.get(config.cookieKey);

    if (!cookieValue) {
      cookieValue = sessionStorage.getItem(config.cookieKey) || '';
    }

    if (cookieValue) {
      try {
        const parsedState = JSON.parse(cookieValue);
        if (this.isValidConsentState(parsedState)) {
          this.consentState$.next(parsedState);
        } else {
          this.cookieService.delete(config.cookieKey, '/');
          sessionStorage.removeItem(config.cookieKey);
          this.consentState$.next(null);
        }
      } catch {
        this.cookieService.delete(config.cookieKey, '/');
        sessionStorage.removeItem(config.cookieKey);
        this.consentState$.next(null);
      }
    } else {
      this.consentState$.next(null);
    }
  }

  private isValidConsentState(value: unknown): value is LuxConsentState {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const state = value as Partial<LuxConsentState>;
    return (
      Array.isArray(state.purposes) &&
      state.purposes.every((purpose) => Object.values(LuxConsentPurpose).includes(purpose as LuxConsentPurpose)) &&
      typeof state.timestamp === 'string'
    );
  }

  private resolveConfig(configOverride?: Partial<ILuxConsentConfig>): ILuxConsentConfig {
    const config = { ...this.consentConfig, ...this.runtimeConfigOverride, ...configOverride };

    if (!config.cookieKey) {
      config.cookieKey = LUX_CONSENT_COOKIE_DEFAULT_KEY;
    }

    if (typeof config.consentCookieDurationDays !== 'number') {
      config.consentCookieDurationDays = LUX_CONSENT_COOKIE_DEFAULT_DURATION_DAYS;
    }

    return config;
  }
}
