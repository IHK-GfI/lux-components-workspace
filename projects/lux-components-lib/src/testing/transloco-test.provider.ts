import { inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { provideTransloco, TranslocoLoader, TranslocoService } from '@jsverse/transloco';
import { of } from 'rxjs';
// Hinweis: setzt "resolveJsonModule" in tsconfig voraus (in Angular Projekten standardmäßig aktiv)
// Falls nicht aktiv, bitte in tsconfig.lib.json ergänzen.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Typen aus JSON
import deBase from '../../locale/luxc-de.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import enBase from '../../locale/luxc-en.json';

/**
 * Test-Provider für Transloco.
 * Lädt standardmäßig die echten Library-Übersetzungen (luxc-de/en) und merged optionale Overrides.
 * Optional können einzelne Keys für spezifische Tests überschrieben werden:
 *   provideLuxTranslocoTesting({ de: { 'some.key': 'Neuer Wert' } })
 */
export function provideLuxTranslocoTesting(customLangs: Record<string, any> = {}) {
  class TestingLoader implements TranslocoLoader {
    getTranslation(lang: string) {
      // Synchronous: real base translations + optional test overrides
      const base = lang === 'de' ? (deBase as any) : lang === 'en' ? (enBase as any) : {};
      const merged = { ...base, ...(customLangs[lang] || {}) };
      return of(merged);
    }
  }

  return makeEnvironmentProviders([
    provideTransloco({
      config: {
        availableLangs: [
          { id: 'de', label: 'Deutsch' },
          { id: 'en', label: 'English' }
        ],
        defaultLang: 'de',
        reRenderOnLangChange: true,
        prodMode: true,
        // luxc-de/en.json enthalten bewusst leere Übersetzungen (z.B. "aria.title.link.lbl") als
        // Signal für Komponenten, auf einen anderen Fallback-Wert auszuweichen. Ohne allowEmpty
        // behandelt Transloco einen leeren String wie einen fehlenden Key: es loggt "Missing
        // translation" UND liefert den unübersetzten Key statt "" zurück, was den Fallback in der
        // konsumierenden Komponente unwirksam macht. allowEmpty betrifft nur Keys mit Wert "";
        // echte fehlende Keys (Wert undefined) lösen weiterhin die reguläre Missing-Warnung aus.
        missingHandler: { allowEmpty: true }
      },
      loader: TestingLoader
    }),
    provideAppInitializer(() => {
      const t = inject(TranslocoService);
      t.setActiveLang('de');
      t.setTranslation(deBase as any, 'de', { merge: true });
      t.setTranslation(enBase as any, 'en', { merge: true });
      if (customLangs['de']) t.setTranslation(customLangs['de'], 'de', { merge: true });
      if (customLangs['en']) t.setTranslation(customLangs['en'], 'en', { merge: true });
    })
  ]);
}
