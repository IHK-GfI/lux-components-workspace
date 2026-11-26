import { InjectionToken } from '@angular/core';

/**
 * Liefert Komponenten, die über LuxSnackbarService.openComponent() angezeigt werden, das übergebene Datenobjekt.
 *
 * @example
 * ```ts
 * readonly data = inject<MyData>(LUX_SNACKBAR_DATA);
 * ```
 */
export const LUX_SNACKBAR_DATA = new InjectionToken<unknown>('LUX_SNACKBAR_DATA');
