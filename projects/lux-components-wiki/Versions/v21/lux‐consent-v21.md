# LUX-Consent

![Beispielbild LUX-Consent](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v21/lux‐consent-v21-img.png)

- [LUX-Consent](#lux-consent)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
  - [Komponenten](#komponenten)
    - [LuxConsentDialogComponent](#luxconsentdialogcomponent)
  - [Services / Tokens](#services--tokens)
    - [LuxConsentService](#luxconsentservice)
    - [LUX\_CONSENT\_CONFIG](#lux_consent_config)
    - [LUX\_CONSENT\_DIALOG\_LAUNCHER](#lux_consent_dialog_launcher)
  - [Modelle / Interfaces](#modelle--interfaces)
    - [ILuxConsentConfig](#iluxconsentconfig)
    - [LuxConsentEntry](#luxconsententry)
    - [LuxConsentState](#luxconsentstate)
    - [LuxConsentPurpose](#luxconsentpurpose)
    - [LuxConsentStorageType](#luxconsentstoragetype)
  - [Verwendung](#verwendung)
    - [Nur eine Sprache](#nur-eine-sprache)
      - [Einwilligung anlegen](#einwilligung-anlegen)
      - [Einwilligung einbinden](#einwilligung-einbinden)
      - [Einwilligung abfragen](#einwilligung-abfragen)
    - [Mehrere Sprachen](#mehrere-sprachen)
      - [Einwilligung anlegen](#einwilligung-anlegen-1)
      - [Einwilligung einbinden](#einwilligung-einbinden-1)
      - [Einwilligung abfragen](#einwilligung-abfragen-1)
  - [Zusatzinformationen](#zusatzinformationen)

## Overview / API

### Allgemein

| Name       | Beschreibung                                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Service    | LuxConsentService                                                                                                                      |
| Komponente | LuxConsentDialogComponent                                                                                                              |
| Zweck      | Verwaltung und Anzeige einer Cookie-/Storage-Einwilligung mit persistenter Speicherung im Cookie und temporärer Session-Fallback-Logik |

| API                                          | Beschreibung                                                               |
| -------------------------------------------- | -------------------------------------------------------------------------- |
| open(configOverride?)                        | Öffnet den Consent-Dialog direkt.                                          |
| openIfNeeded(configOverride?)                | Öffnet den Dialog nur dann, wenn noch keine gültige Einwilligung vorliegt. |
| acceptAll(configOverride?)                   | Speichert alle konfigurierten Zweckarten als akzeptiert.                   |
| declineNonFunctional(configOverride?)        | Speichert nur notwendige (`essential`) Einwilligung.                       |
| saveCustomConsent(purposes, configOverride?) | Speichert eine benutzerdefinierte Auswahl (inkl. `essential`).             |
| getConsentState()                            | Liefert den aktuellen Consent-Status als Observable.                       |
| hasConsent(purpose)                          | Prüft, ob eine konkrete Zweckart freigegeben ist.                          |
| clearConsent(configOverride?)                | Entfernt Cookie + Session-Consent vollständig.                             |
| clearSessionConsent(configOverride?)         | Entfernt nur den Session-Consent.                                          |

## Komponenten

### LuxConsentDialogComponent

Standalone-Dialogkomponente für die Einwilligung. Sie wird standardmäßig lazy über den Consent-Launcher geöffnet und nutzt intern `lux-dialog-structure`.

| Name     | Beschreibung                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------- |
| selector | lux-consent-dialog                                                                                    |
| Anzeige  | Zusammenfassung + Detailansicht mit Zweckarten, Storage-Typen und Tabellen für konfigurierte Einträge |

## Services / Tokens

### LuxConsentService

Zentraler Service für Öffnen des Dialogs, Persistenz und Abfrage der Einwilligung.

| Methode                                      | Rückgabe                              | Beschreibung                                                                                   |
| -------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| getCurrentConfig()                           | ILuxConsentConfig                     | Liefert die effektiv aufgelöste Consent-Konfiguration.                                         |
| open(configOverride?)                        | void                                  | Öffnet den Consent-Dialog.                                                                     |
| openIfNeeded(configOverride?)                | void                                  | Öffnet nur, wenn kein Cookie und kein Session-Eintrag vorhanden sind.                          |
| getConsentState()                            | Observable\<LuxConsentState \| null\> | Stream des aktuellen Consent-Status.                                                           |
| hasConsent(purpose)                          | boolean                               | Prüft eine konkrete Zweckart.                                                                  |
| shouldShowDialog(configOverride?)            | boolean                               | Prüft, ob der Dialog angezeigt werden muss.                                                    |
| acceptAll(configOverride?)                   | void                                  | Akzeptiert alle durch `entries` verwendeten Zwecke + `essential`.                              |
| declineNonFunctional(configOverride?)        | void                                  | Lehnt optionale Zwecke ab (nur `essential`).                                                   |
| saveCustomConsent(purposes, configOverride?) | void                                  | Speichert individuelle Auswahl.                                                                |
| onCloseDialog(configOverride?)               | void                                  | Setzt Session-Fallback mit `essential`, wenn Dialog ohne persistente Auswahl geschlossen wird. |
| clearConsent(configOverride?)                | void                                  | Löscht Consent-Cookie und Session-Eintrag.                                                     |
| clearSessionConsent(configOverride?)         | void                                  | Löscht nur Session-Eintrag.                                                                    |

### LUX_CONSENT_CONFIG

InjectionToken für die globale Consent-Konfiguration.

| Name               | Typ                                 | Beschreibung                            |
| ------------------ | ----------------------------------- | --------------------------------------- |
| LUX_CONSENT_CONFIG | InjectionToken\<ILuxConsentConfig\> | Globale Basiskonfiguration für Consent. |

Hinweis: Ohne eigene Konfiguration wird `cookieKey = "lux-app-consent"` genutzt. Für produktive Anwendungen sollte immer ein app-spezifischer Cookie-Key gesetzt werden.

### LUX_CONSENT_DIALOG_LAUNCHER

InjectionToken zum Austauschen des Standard-Öffnungsverhaltens des Consent-Dialogs.

| Name                        | Typ                                         | Beschreibung                                  |
| --------------------------- | ------------------------------------------- | --------------------------------------------- |
| LUX_CONSENT_DIALOG_LAUNCHER | InjectionToken\<ILuxConsentDialogLauncher\> | Ermöglicht benutzerdefinierte Dialog-Öffnung. |

## Modelle / Interfaces

### ILuxConsentConfig

| Name                       | Typ                                            | Beschreibung                                                                                           |
| -------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| cookieKey                  | string                                         | Schlüssel für persistente Einwilligung im Cookie.                                                      |
| entries                    | LuxConsentEntry[] \| undefined                 | Zusätzliche app-spezifische Consent-Einträge (werden mit den LUX-Components-Defaults zusammengeführt). |
| impressumUrl               | string \| undefined                            | Alternative URL für Impressum.                                                                         |
| impressumComponent         | Type\<unknown\> \| undefined                   | Statisch gesetzte Impressum-Komponente.                                                                |
| impressumComponentLoader   | () =\> Promise\<Type\<unknown\>\> \| undefined | Lazy-Loader für Impressum-Komponente.                                                                  |
| impressumComponentInputs   | Record\<string, unknown\> \| undefined         | Inputs für Impressum-Komponente.                                                                       |
| datenschutzUrl             | string \| undefined                            | Alternative URL für Datenschutz.                                                                       |
| datenschutzComponent       | Type\<unknown\> \| undefined                   | Statisch gesetzte Datenschutz-Komponente.                                                              |
| datenschutzComponentLoader | () =\> Promise\<Type\<unknown\>\> \| undefined | Lazy-Loader für Datenschutz-Komponente.                                                                |
| datenschutzComponentInputs | Record\<string, unknown\> \| undefined         | Inputs für Datenschutz-Komponente.                                                                     |

### LuxConsentEntry

Beschreibt einen technisch verwendeten Cookie-/Storage-Eintrag, der im Dialog transparent angezeigt wird.

| Name              | Typ                   | Beschreibung                                                |
| ----------------- | --------------------- | ----------------------------------------------------------- |
| type              | LuxConsentStorageType | Art des Speichers (Cookie, Local Storage, Session Storage). |
| name              | string                | Schlüsselname des Eintrags.                                 |
| nameIsPrefix      | boolean \| undefined  | Markiert den Namen als Präfix für dynamische Keys.          |
| processingCountry | string                | Land, in dem die Daten verarbeitet werden.                  |
| purpose           | LuxConsentPurpose     | Zweckart des Eintrags.                                      |
| duration          | string                | Speicherdauer (z. B. `persistent`, `session`, `30 Tage`).   |
| description       | string                | Fachliche Beschreibung des Eintrags.                        |

### LuxConsentState

| Name      | Typ                 | Beschreibung                            |
| --------- | ------------------- | --------------------------------------- |
| purposes  | LuxConsentPurpose[] | Freigegebene Zweckarten.                |
| timestamp | string              | Zeitpunkt der Speicherung (ISO-String). |

### LuxConsentPurpose

Enum der unterstützten Zweckarten:

- `essential`
- `preferences`
- `statistics`
- `marketing`
- `other`

### LuxConsentStorageType

Enum der unterstützten Speicherarten:

- `Cookie`
- `Local Storage`
- `Session Storage`

## Verwendung

### Nur eine Sprache

#### Einwilligung anlegen

```typescript
import { LUX_CONSENT_CONFIG, LuxConsentPurpose, LuxConsentStorageType } from '@ihk-gfi/lux-components';

export const appConsentProvider = {
  provide: LUX_CONSENT_CONFIG,
  useFactory: () => ({
    cookieKey: 'lux-blueprint-consent',
    // impressumUrl: 'https://www.ihk-gfi.de/impressum/',
    impressumComponentLoader: () => import('./components/impressum/impressum.component').then((m) => m.ImpressumComponent),
    // datenschutzUrl: 'https://www.ihk-gfi.de/datenschutz/',
    datenschutzComponentLoader: () => import('./components/datenschutz/datenschutz.component').then((m) => m.DatenschutzComponent),
    entries: [
      {
        type: LuxConsentStorageType.Cookie,
        name: 'lux-blueprint-consent',
        processingCountry: 'Deutschland',
        purpose: LuxConsentPurpose.Essential,
        duration: '365 Tage',
        description: 'Speichert die Einwilligung.'
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
```

#### Einwilligung einbinden

_app.config.ts_ (neu) oder _app.module.ts_ (alt):

```typescript
providers: [
  ...,
  appConsentProvider
]
```

Anmerkung: Die _openIfNeeded_-Methode öffnet den Einwilligungsdialog nur, wenn kein Einwilligungscookie vorliegt und es mindestens einen Eintrag mit einem anderen Verwendungszweck als _LuxConsentPurpose.Essential_ gibt. Soll der Dialog in jedem Fall geöffnet werden, muss die _open_-Methode verwendet werden.

_app.component.ts_:

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LUX_CONSENT_CONFIG, LuxAppFooterLinkService, LuxAppFooterLinkInfo, LuxConsentService, LuxMediaQueryObserverService,... } from '@ihk-gfi/lux-components';
...

export class AppComponent implements OnInit {
  private readonly linkService = inject(LuxAppFooterLinkService);
  private readonly consentConfig = inject(LUX_CONSENT_CONFIG);
  private readonly consentService = inject(LuxConsentService);
  private readonly mediaService = inject(LuxMediaQueryObserverService);
  ...

  mobileView = false;
  ...

  constructor() {
    ...
    
    this.mediaService.getMediaQueryChangedAsObservable().pipe(takeUntilDestroyed()).subscribe(() => {
      this.mobileView = this.mediaService.isSmallerOrEqual('md');
    });
  }

  ngOnInit(): void {
    this.linkService.pushLinkInfos(
      ...
      new LuxAppFooterLinkInfo(this.hasNonEssentialEntries() ? 'Einwilligung' : 'Cookie-Einstellungen', '', true, false, () => this.onOpenConsent())
    );

    this.consentService.openIfNeeded();
  }

  onOpenConsent(): void {
    this.consentService.open();
  }

  hasNonEssentialEntries(): boolean {
    return !!this.consentConfig.entries && this.consentConfig.entries.some((entry) => entry.purpose !== LuxConsentPurpose.Essential);
  }
}
```

_app.component.html_:

```html
  <lux-app-header-ac-nav-menu>
  @if (mobileView) {
    <lux-app-header-ac-nav-menu-item
      [luxLabel]="hasNonEssentialEntries() ? 'Einwilligung' : 'Cookie-Einstellungen'"
      (luxClicked)="onOpenConsent()">
    </lux-app-header-ac-nav-menu-item>
  }
  </lux-app-header-ac-nav-menu>
```

#### Einwilligung abfragen

An jeder Code-Stelle kann die Einwilligung wie folgt abgefragt werden:

```typescript
import { inject } from '@angular/core';
import { LuxConsentPurpose, LuxConsentService } from '@ihk-gfi/lux-components';

export class MyComponent {
  ...
  private readonly consentService = inject(LuxConsentService);
  ...

  onLoremIpsum() {
   if (this.consentService.hasConsent(LuxConsentPurpose.Preferences)) {
     // Funktionalität aktivieren
   }
  }
}
```

### Mehrere Sprachen

#### Einwilligung anlegen

```typescript
import { TranslocoService } from '@jsverse/transloco';
import { LUX_CONSENT_CONFIG, LuxConsentEntry, LuxConsentPurpose, LuxConsentStorageType } from '@ihk-gfi/lux-components';

interface ConsentEntryTranslation {
  processingCountry: string;
  duration: string;
  description: string;
}

const CONSENT_TRANSLATION_KEYS = {
  countryGermany: 'luxbp.consent.country.germany',
  duration365Days: 'luxbp.consent.duration.365days',
  durationSessionEnd: 'luxbp.consent.duration.sessionEnd',
  appConsentDescription: 'luxbp.consent.description.appConsent',
  xsrfDescription: 'luxbp.consent.description.xsrf',
  jsessionIdDescription: 'luxbp.consent.description.jsessionid'
} as const;

function createTranslations(translocoService: TranslocoService): {
  appConsent: ConsentEntryTranslation;
  xsrf: ConsentEntryTranslation;
  jsessionid: ConsentEntryTranslation;
} {
  return {
    appConsent: {
      processingCountry: translocoService.translate(CONSENT_TRANSLATION_KEYS.countryGermany),
      duration: translocoService.translate(CONSENT_TRANSLATION_KEYS.duration365Days),
      description: translocoService.translate(CONSENT_TRANSLATION_KEYS.appConsentDescription)
    },
    xsrf: {
      processingCountry: translocoService.translate(CONSENT_TRANSLATION_KEYS.countryGermany),
      duration: translocoService.translate(CONSENT_TRANSLATION_KEYS.durationSessionEnd),
      description: translocoService.translate(CONSENT_TRANSLATION_KEYS.xsrfDescription)
    },
    jsessionid: {
      processingCountry: translocoService.translate(CONSENT_TRANSLATION_KEYS.countryGermany),
      duration: translocoService.translate(CONSENT_TRANSLATION_KEYS.durationSessionEnd),
      description: translocoService.translate(CONSENT_TRANSLATION_KEYS.jsessionIdDescription)
    }
  };
}

export const appConsentProvider = {
  provide: LUX_CONSENT_CONFIG,
  deps: [TranslocoService],
  useFactory: (translocoService: TranslocoService) => {
    const consentConfig = {
      cookieKey: 'BP_LUX_APP_CONSENT',
      // impressumUrl: 'https://www.ihk-gfi.de/impressum/',
      impressumComponentLoader: () => import('./components/impressum/impressum.component').then((m) => m.ImpressumComponent),
      impressumComponentInputs: { fullWidth: true },
      // datenschutzUrl: 'https://www.ihk-gfi.de/datenschutz/',
      datenschutzComponentLoader: () => import('./components/datenschutz/datenschutz.component').then((m) => m.DatenschutzComponent),
      datenschutzComponentInputs: { fullWidth: true },
      entries: [] as LuxConsentEntry[]
    };

    const updateEntries = () => {
      const translations = createTranslations(translocoService);
      consentConfig.entries = [
        {
          type: LuxConsentStorageType.Cookie,
          name: 'BP_LUX_APP_CONSENT',
          processingCountry: translations.appConsent.processingCountry,
          purpose: LuxConsentPurpose.Essential,
          duration: translations.appConsent.duration,
          description: translations.appConsent.description
        },
        {
          type: LuxConsentStorageType.Cookie,
          name: 'LUXBP_XSRF-TOKEN',
          processingCountry: translations.xsrf.processingCountry,
          purpose: LuxConsentPurpose.Essential,
          duration: translations.xsrf.duration,
          description: translations.xsrf.description
        },
        {
          type: LuxConsentStorageType.Cookie,
          name: 'BP_JSESSIONID',
          processingCountry: translations.jsessionid.processingCountry,
          purpose: LuxConsentPurpose.Essential,
          duration: translations.jsessionid.duration,
          description: translations.jsessionid.description
        }
      ];
    };

    updateEntries();
    translocoService.langChanges$.subscribe(() => updateEntries());

    return consentConfig;
  }
};
```

#### Einwilligung einbinden

_app.config.ts_ (neu) oder _app.module.ts_ (alt):

```typescript
providers: [
  ...,
  appConsentProvider
]
```

Anmerkung: Die _openIfNeeded_-Methode öffnet den Einwilligungsdialog nur, wenn kein Einwilligungscookie vorliegt und es mindestens einen Eintrag mit einem anderen Verwendungszweck als _LuxConsentPurpose.Essential_ gibt. Soll der Dialog in jedem Fall geöffnet werden, muss die _open_-Methode verwendet werden.

_app.component.ts_:

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LUX_CONSENT_CONFIG, LuxAppFooterLinkService, LuxAppFooterLinkInfo, LuxConsentService, LuxMediaQueryObserverService,... } from '@ihk-gfi/lux-components';
...

export class AppComponent implements OnInit {
  private readonly linkService = inject(LuxAppFooterLinkService);
  private readonly consentConfig = inject(LUX_CONSENT_CONFIG);
  private readonly consentService = inject(LuxConsentService);
  private readonly mediaService = inject(LuxMediaQueryObserverService);
  ...

  mobileView = false;
  ...

  constructor() {
    ...
    
    this.tService.langChanges$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.updateFooterLinks();
    });

    this.mediaService.getMediaQueryChangedAsObservable().pipe(takeUntilDestroyed()).subscribe(() => {
      this.mobileView = this.mediaService.isSmallerOrEqual('md');
    });
  }

  ngOnInit(): void {
    this.linkService.pushLinkInfos(
      ...
      new LuxAppFooterLinkInfo(this.hasNonEssentialEntries() ? 'Einwilligung' : 'Cookie-Einstellungen', '', true, false, () => this.onOpenConsent())
    );

    this.consentService.openIfNeeded();
  }

  onOpenConsent(): void {
    this.consentService.open();
  }

  hasNonEssentialEntries(): boolean {
    return !!this.consentConfig.entries && this.consentConfig.entries.some((entry) => entry.purpose !== LuxConsentPurpose.Essential);
  }

  private updateFooterLinks() {
    this.linkService.linkInfos = [
      ...
        this.tService.translate(`luxbp.footer.btn.consent${!this.hasNonEssentialEntries() ? '.onlyEssential' : ''}`),
        '',
        true,
        false,
        () => this.onOpenConsent()
      )
    ];
  }
}
```

_app.component.html_:

```html
  <lux-app-header-ac-nav-menu>
  @if (mobileView) {
    <lux-app-header-ac-nav-menu-item
      luxLabel="{{ 'luxbp.footer.btn.consent' + (!hasNonEssentialEntries() ? '.onlyEssential' : '') | transloco }}"
      (luxClicked)="onOpenConsent()">
    </lux-app-header-ac-nav-menu-item>
  }
  </lux-app-header-ac-nav-menu>
```

#### Einwilligung abfragen

An jeder Code-Stelle kann die Einwilligung wie folgt abgefragt werden:

```typescript
import { inject } from '@angular/core';
import { LuxConsentPurpose, LuxConsentService } from '@ihk-gfi/lux-components';

export class MyComponent {
  ...
  private readonly consentService = inject(LuxConsentService);
  ...

  onLoremIpsum() {
   if (this.consentService.hasConsent(LuxConsentPurpose.Preferences)) {
     // Funktionalität aktivieren
   }
  }
}
```

## Zusatzinformationen

- Der Consent wird primär als Cookie gespeichert.
- Wird der Dialog ohne Auswahl geschlossen, setzt der Service eine temporäre Session-Einwilligung nur für `essential`.
- `acceptAll()` berücksichtigt die in `entries` vorkommenden Zweckarten sowie immer `essential`.
- Für produktive Nutzung sollte ein eindeutiger `cookieKey` pro Anwendung gesetzt werden, um Konflikte zwischen mehreren LUX-Anwendungen auf derselben Domain zu vermeiden.
