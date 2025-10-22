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
      prodMode: !isDevMode()
    },
    loader: TranslocoHttpLoader
  });
}
