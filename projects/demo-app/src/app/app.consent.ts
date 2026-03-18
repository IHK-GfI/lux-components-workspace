import { LUX_CONSENT_CONFIG, LuxConsentEntry, LuxConsentPurpose, LuxConsentStorageType } from '@ihk-gfi/lux-components';
import { TranslocoService } from '@jsverse/transloco';

interface ConsentEntryTranslation {
  processingCountry: string;
  duration: string;
  description: string;
}

const CONSENT_TRANSLATION_KEYS = {
  countryGermany: 'app.consent.country.germany',
  duration365Days: 'app.consent.duration.365days',
  persistent: 'app.consent.duration.persistent',
  appConsentDescription: 'app.consent.description.appConsent',
  demoConsentDescription: 'app.consent.description.demoConsent',
  themeConsentDescription: 'app.consent.description.themeConsent',
  tableConsentDescription: 'app.consent.description.tableConsent',
  hintConsentDescription: 'app.consent.description.hintConsent'
} as const;

function createTranslations(translocoService: TranslocoService): {
  appConsent: ConsentEntryTranslation;
  demoConsent: ConsentEntryTranslation;
  theme: ConsentEntryTranslation;
  table: ConsentEntryTranslation;
  hint: ConsentEntryTranslation;
} {
  return {
    appConsent: {
      processingCountry: translocoService.translate(CONSENT_TRANSLATION_KEYS.countryGermany),
      duration: translocoService.translate(CONSENT_TRANSLATION_KEYS.duration365Days),
      description: translocoService.translate(CONSENT_TRANSLATION_KEYS.appConsentDescription)
    },
    demoConsent: {
      processingCountry: translocoService.translate(CONSENT_TRANSLATION_KEYS.countryGermany),
      duration: translocoService.translate(CONSENT_TRANSLATION_KEYS.duration365Days),
      description: translocoService.translate(CONSENT_TRANSLATION_KEYS.demoConsentDescription)
    },
    theme: {
      processingCountry: translocoService.translate(CONSENT_TRANSLATION_KEYS.countryGermany),
      duration: translocoService.translate(CONSENT_TRANSLATION_KEYS.persistent),
      description: translocoService.translate(CONSENT_TRANSLATION_KEYS.themeConsentDescription)
    },
    table: {
      processingCountry: translocoService.translate(CONSENT_TRANSLATION_KEYS.countryGermany),
      duration: translocoService.translate(CONSENT_TRANSLATION_KEYS.persistent),
      description: translocoService.translate(CONSENT_TRANSLATION_KEYS.tableConsentDescription)
    },
    hint: {
      processingCountry: translocoService.translate(CONSENT_TRANSLATION_KEYS.countryGermany),
      duration: translocoService.translate(CONSENT_TRANSLATION_KEYS.persistent),
      description: translocoService.translate(CONSENT_TRANSLATION_KEYS.hintConsentDescription)
    }
  };
}

export const appConsentProvider = {
  provide: LUX_CONSENT_CONFIG,
  deps: [TranslocoService],
  useFactory: (translocoService: TranslocoService) => {
    const consentConfig = {
      cookieKey: 'lux-app-demo-consent',
      impressumComponentLoader: () => import('./abstract/impressum/impressum.component').then((m) => m.ImpressumComponent),
      impressumComponentInputs: { fullWidth: true },
      datenschutzComponentLoader: () => import('./abstract/dse/dse.component').then((m) => m.DseComponent),
      datenschutzComponentInputs: { fullWidth: true },
      entries: [] as LuxConsentEntry[]
    };

    const updateEntries = () => {
      const translations = createTranslations(translocoService);
      consentConfig.entries = [
        {
          type: LuxConsentStorageType.Cookie,
          name: 'lux-app-demo-consent',
          processingCountry: translations.appConsent.processingCountry,
          purpose: LuxConsentPurpose.Essential,
          duration: translations.appConsent.duration,
          description: translations.appConsent.description
        },
        {
          type: LuxConsentStorageType.Cookie,
          name: 'lux-app-demo-consent-example',
          processingCountry: translations.demoConsent.processingCountry,
          purpose: LuxConsentPurpose.Essential,
          duration: translations.demoConsent.duration,
          description: translations.demoConsent.description
        },
        {
          type: LuxConsentStorageType.LocalStorage,
          name: 'lux.app.theme.name',
          processingCountry: translations.theme.processingCountry,
          purpose: LuxConsentPurpose.Preferences,
          duration: translations.theme.duration,
          description: translations.theme.description
        },
        {
          type: LuxConsentStorageType.LocalStorage,
          name: 'lux.app.demo.table',
          nameIsPrefix: false,
          processingCountry: translations.table.processingCountry,
          purpose: LuxConsentPurpose.Preferences,
          duration: translations.table.duration,
          description: translations.table.description
        },
        {
          type: LuxConsentStorageType.LocalStorage,
          name: 'lux.app.tour-hint.dsa.*',
          nameIsPrefix: true,
          processingCountry: translations.hint.processingCountry,
          purpose: LuxConsentPurpose.Preferences,
          duration: translations.hint.duration,
          description: translations.hint.description
        }
      ];
    };

    updateEntries();
    translocoService.langChanges$.subscribe(() => updateEntries());

    return consentConfig;
  }
};
