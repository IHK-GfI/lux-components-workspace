import { InjectionToken } from '@angular/core';

/**
 * Die Art einer Snackbar-Nachricht. Bestimmt das Standard-Icon und die Standard-Farbe
 * und kann eigene Anzeigelimits haben (siehe provideLuxSnackbar() in @ihk-gfi/lux-components/lux-snackbar).
 */
export type LuxSnackbarType = 'info' | 'warning' | 'error' | 'success';

/**
 * Die Angaben, mit denen Komponenten des Hauptpakets eine Snackbar-Nachricht öffnen.
 */
export interface LuxSnackbarOpenerConfig {
  text: string;
  action?: string;
  type?: LuxSnackbarType;
}

/**
 * Referenz auf eine über LUX_SNACKBAR_OPENER geöffnete Nachricht (Teil der LuxSnackbarRef).
 */
export interface LuxSnackbarOpenerRef {
  dismiss(): void;
}

/**
 * Schnittstelle, über die Komponenten des Hauptpakets (z.B. lux-stepper-large) Snackbar-Nachrichten öffnen,
 * ohne den Entry Point @ihk-gfi/lux-components/lux-snackbar zu importieren.
 */
export interface LuxSnackbarOpener {
  open(duration: number, config: LuxSnackbarOpenerConfig): LuxSnackbarOpenerRef;
}

/**
 * Wird von provideLuxSnackbar() (@ihk-gfi/lux-components/lux-snackbar) mit dem LuxSnackbarService belegt.
 * Ohne diesen Provider bleibt das Token leer und die Komponenten fallen auf eine Screenreader-Ansage zurück.
 */
export const LUX_SNACKBAR_OPENER = new InjectionToken<LuxSnackbarOpener>('LUX_SNACKBAR_OPENER');
