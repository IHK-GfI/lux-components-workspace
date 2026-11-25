import { InjectionToken } from '@angular/core';
import { LuxSnackbarType } from '@ihk-gfi/lux-components';

/**
 * Legt fest, wie viele Snackbar-Nachrichten gleichzeitig sichtbar sind.
 * Weitere Nachrichten werden im Hinweis "und X weitere Nachrichten" zusammengefasst.
 * Werte kleiner als 1 werden als 1 behandelt.
 */
export interface LuxSnackbarLimits {
  /**
   * Ohne maxVisiblePerType: Anzahl der insgesamt sichtbaren Nachrichten.
   * Mit maxVisiblePerType: Limit für Typen ohne eigenen Wert und für Nachrichten ohne Typ.
   * Default: 1.
   */
  maxVisible?: number;

  /**
   * Limit je Typ (z.B. { info: 2, error: 3, warning: 1 }). Ist dieser Wert gesetzt,
   * gilt für jeden Typ sein eigenes Limit und es gibt kein Gesamtlimit.
   */
  maxVisiblePerType?: Partial<Record<LuxSnackbarType, number>>;
}

/**
 * Die Start-Limits des LuxSnackbarService (wird von provideLuxSnackbar() gesetzt).
 */
export const LUX_SNACKBAR_LIMITS = new InjectionToken<LuxSnackbarLimits>('LUX_SNACKBAR_LIMITS');
