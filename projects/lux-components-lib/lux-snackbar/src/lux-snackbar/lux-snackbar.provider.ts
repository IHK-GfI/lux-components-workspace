import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { LUX_SNACKBAR_OPENER } from '@ihk-gfi/lux-components';
import { LUX_SNACKBAR_LIMITS, LuxSnackbarLimits } from './lux-snackbar-limits';
import { LuxSnackbarService } from './lux-snackbar.service';

/**
 * Richtet die Snackbar ein: setzt die Start-Limits und stellt den LuxSnackbarService den Komponenten des
 * Hauptpakets zur Verfügung (z.B. lux-stepper-large für die Meldung "Schritt unvollständig").
 *
 * @example
 * ```ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [provideLuxSnackbar({ maxVisible: 3 })]
 * };
 * ```
 *
 * @param limits Wie viele Nachrichten gleichzeitig sichtbar sind (Default: 1).
 */
export function provideLuxSnackbar(limits?: LuxSnackbarLimits): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: LUX_SNACKBAR_LIMITS, useValue: limits ?? {} },
    { provide: LUX_SNACKBAR_OPENER, useExisting: LuxSnackbarService }
  ]);
}
