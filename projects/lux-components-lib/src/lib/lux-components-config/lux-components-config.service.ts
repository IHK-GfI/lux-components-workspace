import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable } from 'rxjs';
import { LuxComponentsConfigParameters } from './lux-components-config-parameters.interface';
import { LuxConfigTokenService } from './lux-components-config.module';

/**
 * Dieser Service wird dazu verwendet, auf die Konfiguration der LuxComponents zuzugreifen und diese auszulesen bzw.
 * auch zu aktualisieren.
 */
@Injectable({
  providedIn: 'root'
})
export class LuxComponentsConfigService {
  private lastUseLocalStorageForComponentsAllowed = false;
  public static readonly DEFAULT_CONFIG = {
    iconBasePath: '/',
    displayLuxConsoleLogs: false,
    generateLuxTagIds: false,
    lookupServiceUrl: '/lookup/',
    tenantLogoLookupServiceUrl: '/assets/ihk-logos/',
    labelConfiguration: {
      allUppercase: false,
      notAppliedTo: []
    },
    cardExpansionAnimationActive: true,
    rippleConfiguration: {
      exitDuration: 500,
      enterDuration: 500
    },
    buttonConfiguration: {
      throttleTimeMs: 600
    },
    viewConfiguration: {
      centeredView: false,
      centeredWidth: '1500px'
    },
    appFooter: {
      fixedDesktop: true,
      fixedMobile: true
    },
    useLocalStorageForComponentsAllowed: false
  };

  private config$: BehaviorSubject<LuxComponentsConfigParameters> = new BehaviorSubject<LuxComponentsConfigParameters>(
    LuxComponentsConfigService.DEFAULT_CONFIG
  );

  /**
   * Gibt das Observable mit der aktuell gesetzten Konfiguration zurück.
   */
  get config(): Observable<LuxComponentsConfigParameters> {
    return this.config$.asObservable();
  }

  /**
   * Gibt die aktuell gesetzte Konfiguration direkt zurück.
   */
  get currentConfig(): LuxComponentsConfigParameters {
    return this.config$.getValue();
  }

  constructor() {
    const config = inject<LuxComponentsConfigParameters>(LuxConfigTokenService, { optional: true });

    // Wenn keine Konfiguration geladen werden konnte, Standard-Konfiguration benutzen.
    if (!config) {
      this.config$.next(LuxComponentsConfigService.DEFAULT_CONFIG);
    } else {
      this.config$.next(this.mergeDefaultData(config));
    }

    // Initial-Warnung, falls LocalStorage nicht erlaubt ist
    this.lastUseLocalStorageForComponentsAllowed = !!this.currentConfig.useLocalStorageForComponentsAllowed;
    if (!this.lastUseLocalStorageForComponentsAllowed) {
      this.logLocalStorageWarning();
    }

    // Warnung bei jeder Änderung
    this.config$.pipe(takeUntilDestroyed()).subscribe((cfg) => {
      const nextAllowed = !!cfg.useLocalStorageForComponentsAllowed;
      if (this.lastUseLocalStorageForComponentsAllowed !== nextAllowed && !nextAllowed) {
        this.logLocalStorageWarning();
      }
      this.lastUseLocalStorageForComponentsAllowed = nextAllowed;
    });
  }
  /**
   * Gibt eine Warnung aus, wenn LocalStorage nicht erlaubt ist.
   */
  private logLocalStorageWarning() {
    console.warn(
      'Achtung: Die Nutzung des Local Storage ist deaktiviert (useLocalStorageAllowed = false). Die Funktionsweise der App ist eingeschränkt. Die Komponenten LUX-Table, LUX-Tour-Hint und das LUX-Theme können ihre Einstellungen nicht im Local Storage speichern.'
    );
  }

  /**
   * Gibt zurück, ob die Labels als Uppercase gekennzeichnet sind und ob
   * die übergebenen Selektoren in den Ausnahmen geführt sind.
   * @param selector
   */
  isLabelUppercaseForSelector(selector: string): boolean {
    const config = this.config$.value;
    return (
      !!config.labelConfiguration &&
      config.labelConfiguration.allUppercase &&
      config.labelConfiguration.notAppliedTo.indexOf(selector) === -1
    );
  }

  /**
   * Ersetzt die aktuelle Konfiguration mit der übergebenen (wenn gültiger Wert).
   * @param config
   */
  updateConfiguration(config: LuxComponentsConfigParameters) {
    if (!config) {
      console.warn('The new configuration is undefined or null and was ignored.');
    } else {
      this.config$.next(this.mergeDefaultData(config));
    }
  }

  /**
   * Kombiniert die übergebene Konfiguration mit der Standard-Konfiguration.
   *
   * Übernimmt die Werte aus der Standard-Konfiguration, die nicht im übergebenen gesetzt wurden.
   * @param config
   */
  private mergeDefaultData(config: LuxComponentsConfigParameters): LuxComponentsConfigParameters {
    return { ...LuxComponentsConfigService.DEFAULT_CONFIG, ...config };
  }
}
