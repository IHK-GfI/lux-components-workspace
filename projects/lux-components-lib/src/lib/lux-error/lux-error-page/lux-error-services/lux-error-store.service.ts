import { Injectable, Signal, signal } from '@angular/core';
import { ILuxErrorPageConfig } from '../lux-error-interfaces/lux-error-page-config.interface';
import { ILuxError } from '../lux-error-interfaces/lux-error.interface';

/**
 * Dieser Service dient dazu, die aktuellen Fehlermeldungen und die Error-Page Konfiguration zu speichern.
 *
 * Er wird von LuxErrorService und LuxErrorPageComponent benutzt, ohne ihn gäbe es Cycle-Dependency Fehler.
 */
@Injectable({
  providedIn: 'root'
})
export class LuxErrorStoreService {
  /**
   * Enthält die normale Konfiguration der Fehlerseite, kann bei Bedarf mit setConfig überschrieben werden.
   */
  static readonly DEFAULT_CONFIG: ILuxErrorPageConfig = {
    iconName: 'lux-interface-delete-2',
    iconSize: '5x',
    errorText: 'Es ist ein Fehler aufgetreten',
    homeRedirectText: 'Zurück zur Startseite',
    homeRedirectUrl: '',
    errorPageUrl: 'errorpage',
    skipLocationChange: true
  };

  /** Die aktuelle Konfiguration der Fehlerseite. */
  readonly config: Signal<ILuxErrorPageConfig>;
  /** Der aktuelle Fehler. */
  readonly error: Signal<ILuxError | null>;
  /** Ein Array der zuletzt aufgetretenen Fehler. */
  readonly lastErrors: Signal<ILuxError[]>;

  private readonly configSignal = signal<ILuxErrorPageConfig>({});
  private readonly errorSignal = signal<ILuxError | null>(null);
  private readonly lastErrorsSignal = signal<ILuxError[]>([]);

  constructor() {
    this.config = this.configSignal.asReadonly();
    this.error = this.errorSignal.asReadonly();
    this.lastErrors = this.lastErrorsSignal.asReadonly();
  }

  /**
   * Initialisiert den Service.
   */
  init(): void {
    this.lastErrorsSignal.set([]);
    this.errorSignal.set(null);
    this.configSignal.set({});
    this.safeNewConfig(LuxErrorStoreService.DEFAULT_CONFIG);
  }

  /**
   * Sichert den Fehler und fügt ihn der "lastErrors"-Liste hinzu.
   * @param newError
   */
  setError(newError: ILuxError | null): void {
    this.errorSignal.set(newError);

    if (newError) {
      this.lastErrorsSignal.update((errors) => [...errors, newError]);
    }
  }

  /**
   * Diese Methode sichert die übergebene Konfiguration.
   * @param luxErrorPageConfig
   */
  safeNewConfig(luxErrorPageConfig: ILuxErrorPageConfig | null): void {
    const newConfig: ILuxErrorPageConfig = {};

    Object.assign(newConfig, LuxErrorStoreService.DEFAULT_CONFIG);
    Object.assign(newConfig, luxErrorPageConfig ?? {});

    this.configSignal.set(newConfig);
  }
}
