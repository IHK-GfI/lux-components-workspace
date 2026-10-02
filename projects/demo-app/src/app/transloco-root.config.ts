import { isDevMode } from '@angular/core';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';

/**
 * Shared Transloco root provider so the configuration stays in one place.
 */
export function provideLuxTranslocoRoot() {
  return provideTransloco({
    config: {
      availableLangs: [
        { id: 'de', label: 'Deutsch' },
        { id: 'en', label: 'English' }
      ],
      defaultLang: 'de',
      reRenderOnLangChange: true,
      prodMode: !isDevMode(),
      // luxc-de/en.json enthalten bewusst leere Übersetzungen (z.B. "aria.title.link.lbl") als
      // Signal für Lux-Komponenten, auf einen anderen Fallback-Wert auszuweichen. Ohne allowEmpty
      // behandelt Transloco einen leeren String wie einen fehlenden Key: es loggt "Missing
      // translation" UND liefert den unübersetzten Key statt "" zurück, wodurch der Fallback in
      // der jeweiligen Komponente unwirksam wird. allowEmpty betrifft nur Keys mit Wert "";
      // echte fehlende Keys (Wert undefined) lösen weiterhin die reguläre Missing-Warnung aus.
      missingHandler: { allowEmpty: true }
    },
    loader: TranslocoHttpLoader
  });
}
