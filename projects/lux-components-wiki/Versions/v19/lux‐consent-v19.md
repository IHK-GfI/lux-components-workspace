# LUX-Consent

![Beispielbild LUX-Consent](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐consent-v19-img.png)

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
  - [Beispiele](#beispiele)
    - [1. Consent global konfigurieren (Provider)](#1-consent-global-konfigurieren-provider)
    - [2. Dialog beim App-Start nur bei Bedarf öffnen](#2-dialog-beim-app-start-nur-bei-bedarf-öffnen)
    - [3. Dialog manuell öffnen (z. B. Footer-Link)](#3-dialog-manuell-öffnen-z-b-footer-link)
    - [4. Einwilligung gezielt prüfen](#4-einwilligung-gezielt-prüfen)
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
| impressumComponentLoader   | () =\> Promise\<Type\<unknown\>\> \| undefined | Lazy Loader für Impressum-Komponente.                                                                  |
| impressumComponentInputs   | Record\<string, unknown\> \| undefined         | Inputs für Impressum-Komponente.                                                                       |
| datenschutzUrl             | string \| undefined                            | Alternative URL für Datenschutz.                                                                       |
| datenschutzComponent       | Type\<unknown\> \| undefined                   | Statisch gesetzte Datenschutz-Komponente.                                                              |
| datenschutzComponentLoader | () =\> Promise\<Type\<unknown\>\> \| undefined | Lazy Loader für Datenschutz-Komponente.                                                                |
| datenschutzComponentInputs | Record\<string, unknown\> \| undefined         | Inputs für Datenschutz-Komponente.                                                                     |

### LuxConsentEntry

Beschreibt einen technisch verwendeten Cookie-/Storage-Eintrag, der im Dialog transparent angezeigt wird.

| Name              | Typ                   | Beschreibung                                                |
| ----------------- | --------------------- | ----------------------------------------------------------- |
| type              | LuxConsentStorageType | Art des Speichers (Cookie, Local Storage, Session Storage). |
| name              | string                | Schlüsselname des Eintrags.                                 |
| nameIsPrefix      | boolean \| undefined  | Markiert den Namen als Prefix für dynamische Keys.          |
| processingCountry | string                | Land in dem die Daten verarbeitet werden.                   |
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

## Beispiele

### 1. Consent global konfigurieren (Provider)

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

### 2. Dialog beim App-Start nur bei Bedarf öffnen

```typescript
export class AppComponent implements OnInit {
  private consentService = inject(LuxConsentService);

  ngOnInit(): void {
    this.consentService.openIfNeeded();
  }
}
```

### 3. Dialog manuell öffnen (z. B. Footer-Link)

```html
  <lux-app-header-ac-nav-menu>
  @if (mobileView) {
    <lux-app-header-ac-nav-menu-item
      luxLabel="Einwilligung"
      luxAriaLabel="Einwilligung"
      (luxClicked)="onOpenConsent()">
    </lux-app-header-ac-nav-menu-item>
  }
  </lux-app-header-ac-nav-menu>
```

```typescript
export class AppComponent implements OnInit {
  private linkService = inject(LuxAppFooterLinkService);
  private consentService = inject(LuxConsentService);

  ngOnInit(): void {
    this.linkService.pushLinkInfos(
      new LuxAppFooterLinkInfo('Datenschutz', 'datenschutz', true),
      new LuxAppFooterLinkInfo('Impressum', 'impressum'),
      new LuxAppFooterLinkInfo('Lizenzhinweis', 'license-hint'),
      new LuxAppFooterLinkInfo('Einwilligung', '', true, false, () => this.onOpenConsent())
    );

    this.consentService.openIfNeeded();
  }

  onOpenConsent(): void {
    this.consentService.open();
  }
}
```

### 4. Einwilligung gezielt prüfen

```typescript
import { inject } from '@angular/core';
import { LuxConsentPurpose, LuxConsentService } from '@ihk-gfi/lux-components';

const consentService = inject(LuxConsentService);

if (consentService.hasConsent(LuxConsentPurpose.Statistics)) {
  // Statistik-Funktionalität aktivieren
}
```

## Zusatzinformationen

- Der Consent wird primär als Cookie gespeichert.
- Wird der Dialog ohne Auswahl geschlossen, setzt der Service eine temporäre Session-Einwilligung nur für `essential`.
- `acceptAll()` berücksichtigt die in `entries` vorkommenden Zweckarten sowie immer `essential`.
- Für produktive Nutzung sollte ein eindeutiger `cookieKey` pro Anwendung gesetzt werden, um Konflikte zwischen mehreren LUX-Anwendungen auf derselben Domain zu vermeiden.
