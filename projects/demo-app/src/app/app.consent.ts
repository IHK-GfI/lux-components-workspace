import { LUX_CONSENT_CONFIG, LuxConsentPurpose, LuxConsentStorageType } from '@ihk-gfi/lux-components';

export const appConsentProvider = {
  provide: LUX_CONSENT_CONFIG,
  useFactory: () => ({
    cookieKey: 'lux-app-demo-consent',
    impressumComponentLoader: () => import('./abstract/impressum/impressum.component').then((m) => m.ImpressumComponent),
    impressumComponentInputs: { fullWidth: true },
    datenschutzComponentLoader: () => import('./abstract/dse/dse.component').then((m) => m.DseComponent),
    datenschutzComponentInputs: { fullWidth: true },
    entries: [
      {
        type: LuxConsentStorageType.Cookie,
        name: 'lux-app-demo-consent',
        processingCountry: 'Deutschland',
        purpose: LuxConsentPurpose.Essential,
        duration: '365 Tage',
        description: 'Speichert die Einwilligung.'
      },
      {
        type: LuxConsentStorageType.Cookie,
        name: 'lux-app-demo-consent-example',
        processingCountry: 'Deutschland',
        purpose: LuxConsentPurpose.Essential,
        duration: '365 Tage',
        description: 'Speichert die Einwilligung der Demoseite lux-consent.'
      },
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
        name: 'lux.app.tour-hint.dsa.*',
        nameIsPrefix: true,
        processingCountry: 'Deutschland',
        purpose: LuxConsentPurpose.Preferences,
        duration: 'persistent',
        description: 'Speichert, ob die App-Hinweise und App-Touren erneut angezeigt werden sollen.'
      }
    ]
  })
};
