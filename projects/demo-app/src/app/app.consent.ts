import { LUX_CONSENT_CONFIG, LuxConsentPurpose, LuxConsentStorageType } from '@ihk-gfi/lux-components';

export const appConsentProvider = {
  provide: LUX_CONSENT_CONFIG,
  useFactory: () => ({
    cookieKey: 'lux-app-demo-consent',
    impressumComponentLoader: () => import('./abstract/impressum/impressum.component').then((m) => m.ImpressumComponent),
    datenschutzComponentLoader: () => import('./abstract/dse/dse.component').then((m) => m.DseComponent),
    entries: [
      {
        type: LuxConsentStorageType.LocalStorage,
        name: 'lux.app.theme.name',
        processingCountry: 'Deutschland',
        purpose: LuxConsentPurpose.Preferences,
        duration: 'persistent',
        description: 'Speichert das ausgewählte Theme (z. B. "authentic" oder "green").'
      },
      {
        type: LuxConsentStorageType.LocalStorage,
        name: 'lux.app.demo.table',
        nameIsPrefix: false,
        processingCountry: 'Deutschland',
        purpose: LuxConsentPurpose.Preferences,
        duration: 'persistent',
        description: 'Speichert, welche Tabellenspalten ausgeblendet wurden.'
      },
      {
        type: LuxConsentStorageType.LocalStorage,
        name: 'lux.app.tour-hint.dsa.Karte_1',
        nameIsPrefix: false,
        processingCountry: 'Deutschland',
        purpose: LuxConsentPurpose.Preferences,
        duration: 'persistent',
        description: 'Speichert, ob der Hinweis erneut angezeigt werden soll.'
      },
      {
        type: LuxConsentStorageType.LocalStorage,
        name: 'lux.app.tour-hint.dsa.Karte_1.Input_1.Input_2.Und_3.Karte_1.Aktionen.Karte_1.Aktion_1.Karte_1.Aktion_2.Karte_2.Karte_2.Aktion_1',
        nameIsPrefix: false,
        processingCountry: 'Deutschland',
        purpose: LuxConsentPurpose.Preferences,
        duration: 'persistent',
        description: 'Speichert, ob die Tour erneut angezeigt werden soll.'
      }
    ]
  })
};
