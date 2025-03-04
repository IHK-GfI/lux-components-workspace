# Konfiguration

- [Konfiguration](#konfiguration)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
  - [Services](#services)
    - [LuxComponentsConfigService](#luxcomponentsconfigservice)
  - [Classes / Interfaces](#classes--interfaces)
    - [LuxComponentsConfigParameters](#luxcomponentsconfigparameters)
      - [buttonConfiguration](#buttonconfiguration)
      - [rippleConfiguration](#rippleconfiguration)
      - [labelConfiguration](#labelconfiguration)
      - [viewConfiguration](#viewconfiguration)
      - [tenantLogoLookupServiceUrl](#tenantlogolookupserviceurl)
        - [Logos mit der App ausliefern](#logos-mit-der-app-ausliefern)
        - [Logos über ein CDN laden](#logos-über-ein-cdn-laden)
      - [iconBasePath](#iconbasepath)
        - [Icons mit der App ausliefern](#icons-mit-der-app-ausliefern)
        - [Icons über ein CDN laden](#icons-über-ein-cdn-laden)
  - [Beispiele](#beispiele)
    - [1. Config](#1-config)

## Overview / API

### Allgemein

Das LuxComponentsConfigModule wird dazu verwendet bestimmte LuxComponents-weite Einstellungen
festzulegen. Diese gelten dann für die gesamte Applikation.

| Name   | Beschreibung              |
| ------ | ------------------------- |
| import | LuxComponentsConfigModule |

## Services

### LuxComponentsConfigService

Dieser Service wird von den Components benutzt, um die Standardkonfiguration zu nutzen, sollte es keine vom Entwickler übergebene Konfiguration geben.
Des Weiteren bietet er die Möglichkeit, sich zu abonnieren, und so aktualisierte Konfigurationsobjekte zu erhalten.

Dieser Service sollte dann vom Entwickler genutzt werden, wenn die Konfiguration zur Laufzeit der Applikation angepasst werden soll.

| Name der Property/Funktion                                 | Typ/Rückgabewert                             | Beschreibung                                                                                                                                                                                                                                       |
| ---------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DEFAULT_CONFIG (Property)                                  | LuxComponentsConfigParameters                | Statisches Readonly-Objekt, welches die Standardkonfiguration beinhaltet. Wenn keine Konfiguration übergeben wird, wird diese benutzt. Wenn die übergebene Konfiguration bestimmte Werte nicht setzt, werden diese aus der DEFAULT_CONFIG geladen. |
| config (Property)                                          | Observable \<LuxComponentsConfigParameters\> | Gibt ein Observable zurück, welches das aktuelle/neueste Konfigurationsobjekt beinhaltet.                                                                                                                                                          |
| currentConfig                                              | LuxComponentsConfigParameters                | Gibt direkt das aktuelle Konfigurationsobjekt zurück.                                                                                                                                                                                              |
| isLabelUppercaseForSelector(selector: string)              | boolean                                      | Gibt wieder, ob die Labels für bestimmte Komponenten uppercase dargestellt werden sollen und ob das auch auf die Komponente mit dem übergebenen Selektor zutrifft.                                                                                 |
| updateConfiguration(config: LuxComponentsConfigParameters) | void                                         | Ersetzt die aktuelle Konfiguration mit der übergebenen. Auch hier wird bei fehlenden Werten die Standard-Konfiguration zu Rate gezogen.                                                                                                            |

## Classes / Interfaces

### LuxComponentsConfigParameters

| Property                      | Typ     | Beschreibung                                                                                                                                                                                |
| ----------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| generateLuxTagIds?            | boolean | Bestimmt, ob die LuxTagIds (und dazugehörende) Warnungen generiert werden.                                                                                                                  |
| displayLuxConsoleLogs?        | boolean | Bestimmt, ob die Ausgaben des LuxConsoleService in die Developer-Console des Browsers geschrieben werden.                                                                                   |
| lookupServiceUrl?             | string  | Bestimmt den Basepfad des Lookup-Services für die LookupComponents.                                                                                                                         |
| labelConfiguration?           | Object  | Bestimmt, ob die Labels für LuxButtons, LuxLinks, LuxMenuItems, LuxStepper, LuxSideNavItem und LuxTabs immer Uppercase dargestellt werden. Siehe [labelConfiguration](#labelconfiguration). |
| cardExpansionAnimationActive? | boolean | Flag, um die Ausklappanimationen von LuxCards zu aktivieren bzw. zu deaktivieren.                                                                                                           |
| rippleConfiguration?          | Object  | Bestimmt die globalen Einstellungen für die Animationen der LuxRipple-Direktiven. Siehe [rippleConfiguration](#rippleconfiguration).                                                        |
| iconBasePath?                 | string  | Bestimmt den Basepfad der LUX-Icons.                                                                                                                                                        |
| tenantLogoLookupServiceUrl    | string  | Bestimmt den Basepfad der Tenantlogos.                                                                                                                                                      |

#### buttonConfiguration

| Property        | Typ    | Beschreibung                                                         |
| --------------- | ------ | -------------------------------------------------------------------- |
| throttleTimeMs? | number | Verhindert, dass ein Button mehrfach hinter einander ausgelöst wird. |

#### rippleConfiguration

| Property      | Typ     | Beschreibung                                                                                      |
| ------------- | ------- | ------------------------------------------------------------------------------------------------- |
| enterDuration | number  | Definiert die Dauer der Eingangsanimationen.                                                      |
| exitDuration  | number  | Definiert die Dauer der Ausgangsanimationen.                                                      |
| color?        | string  | Enthält die Farbe (beliebiger CSS-gültiger Wert) der Ripples.                                     |
| centered?     | boolean | Bestimmt ob die Animationen vom Zentrum der Ripple-Targets ausgehen oder vom Mausklick.           |
| radius?       | number  | Bestimmt den Radius der Animationen. Wenn 0, werden die Begrenzungen der Ripple-Targets genommen. |
| disabled?     | boolean | Deaktiviert die LuxRipples.                                                                       |
| unbounded?    | boolean | Bestimmt ob die Animationen über die Ripple-Targets hinausgehen oder nicht.                       |

#### labelConfiguration

| Property     | Typ      | Beschreibung                                                                                                                                                                              |
| ------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| allUppercase | boolean  | Bestimmt, ob die Labels für LuxButtons, LuxLinks, LuxMenuItems, LuxStepper, LuxSideNavItem und LuxTabs immer Uppercase dargestellt werden.                                                |
| notAppliedTo | string[] | Definiert ob alle o.g. Komponenten ihre Labels uppercase darstellen. Hier können Ausnahmen eingetragen werden. Dazu einfach den Selektor der Komponente hier eintragen. (z.B. 'lux-link') |

#### viewConfiguration

| Property      | Typ     | Beschreibung                                                                                                                   |
| ------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| centeredView  | boolean | Bestimmt, ob der Inhalt App-Headers-Ac und des App-Footers begrenzt und zentriert angezeigt wird, default = false.             |
| centeredWidth | string  | Definiert die Max-Width (default = 1500px) des Inhaltes des App-Header-Ac und des App-Footers, falls centeredView = true gilt. |

#### tenantLogoLookupServiceUrl

##### Logos mit der App ausliefern

In der Konfiguration in der _app.module.ts_ muss der Logo-Ordner eingetragen werden:

```ts
const myConfiguration: LuxComponentsConfigParameters = {
  ...
  tenantLogoLookupServiceUrl: '/assets/tenant-logos/',
  ...
};
```

Die Logos müssen in den _src/assets/tenant-logos_-Ordner kopiert und mit der App ausgeliefert werden.

##### Logos über ein CDN laden

In der Konfiguration in der _app.module.ts_ muss der Logo-Ordner eingetragen werden:

```ts
const myConfiguration: LuxComponentsConfigParameters = {
  ...
  tenantLogoLookupServiceUrl: 'https://[my-domain].de/tenant-logos/',
  ...
};
```

D.h. die Logos müssen nicht mit der App ausgeliefert werden. Sie werden direkt vom CDN-Server geladen.

#### iconBasePath

##### Icons mit der App ausliefern

Damit die Icons mit der App ausgeliefert werden können, müssen folgende Einstellungen vorgenommen werden.

Abhängigkeit in der _package.json_ hinzufügen:

```json
"dependencies": {
  "@ihk-gfi/lux-components-icons-and-fonts": "x.x.x",
}
```

Die _assets_-Abschnitte in der _angular.json_ ergänzen:

```json
"assets": [
  ...
  {
    "glob": "**/*",
    "input": "./node_modules/@ihk-gfi/lux-components-icons-and-fonts/assets/icons/",
    "output": "./assets/icons"
  },
  {
    "glob": "**/*",
    "input": "./node_modules/@ihk-gfi/lux-components-icons-and-fonts/assets/logos/",
    "output": "./assets/logos"
  },
  {
    "glob": "**/*",
    "input": "./node_modules/@ihk-gfi/lux-components-icons-and-fonts/assets/fonts/",
    "output": "./assets/fonts"
  },
  ...
]
```

Den foldenden Code in der _styles.scss_ ergänzen:

```scss
@import '@ihk-gfi/lux-components-theme/src/base/luxfonts';

$basepath: '/';

@include web-fonts($basepath);
```

##### Icons über ein CDN laden

Damit die Icons über ein CDN geladen werden können, müssen folgende Einstellungen vorgenommen werden.

Abhängigkeit in der _package.json_ hinzufügen, falls noch nicht vorhanden:

```json
"dependencies": {
  "@ihk-gfi/lux-components-icons-and-fonts": "x.x.x",
}
```

Änderungen in den _assets_-Abschnitten in der _angular.json_:

Die folgenden Einträge können gelöscht werden:

```json
"assets": [
  ...
  {
    "glob": "**/*",
    "input": "./node_modules/@ihk-gfi/lux-components-icons-and-fonts/assets/icons/",
    "output": "./assets/icons"
  },
  {
    "glob": "**/*",
    "input": "./node_modules/@ihk-gfi/lux-components-icons-and-fonts/assets/logos/",
    "output": "./assets/logos"
  },
  {
    "glob": "**/*",
    "input": "./node_modules/@ihk-gfi/lux-components-icons-and-fonts/assets/fonts/",
    "output": "./assets/fonts"
  },
  ...
]
```

Der folgende Abschnitt muss ergänzt werden:

```json
"assets": [
  ...
  {
    "glob": "lux-icons.json",
    "input": "./node_modules/@ihk-gfi/lux-components-icons-and-fonts/assets/icons/",
    "output": "./assets/icons"
  },
  ...
]
```

Die Konfiguration in der _app.module.ts_ muss wie folgt angepasst werden:

```ts
const myConfiguration: LuxComponentsConfigParameters = {
  ...
  iconBasePath: 'https://[my-domain].de/lux-components/icons-and-fonts/v1.8.0/',
  ...
};
```

Derselbe Pfad muss in der _styles.scss_ eingesetzt werden:

```scss
@import '@ihk-gfi/lux-components-theme/src/base/luxfonts';

$basepath: 'https://[my-domain].de/lux-components/icons-and-fonts/v1.8.0/';

@include web-fonts($basepath);
```

D.h. die Icons and Fonts müssen nicht mit der App ausgeliefert werden. Sie werden direkt vom CDN-Server geladen.

Im CDN müssen die Icons in den Unterordner _assets_ angelegt werden.
Z.B. _`https://[my-domain].de/lux-components/icons-and-fonts/v1.8.0/assets/icons/Interface-Essentials/Validation/interface-validation-check-circle--checkmark-addition-circle-success-check-validation-add-form.svg`_

**_Wichtig!_** Falls eine CSP (Content Security Policy) den Zugriff auf Icon-Ressourcen einschränkt, muss diese um die CDN-Url (z.B. https://[my-domain].de ) erweitert werden.
Z.B. in Spring-Boot-Projekten kann die CSP (siehe _http - security - csp - connect-src_) über die Konfigurationsdateien _application.yml_, _application-dev.yml_,... festgelegt werden.

## Beispiele

### 1. Config

In der`app.module.ts`-Datei muss das `LuxComponentsConfigModule` importiert und dessen `forRoot`-Methode aufgerufen werden.
Diese Methode erwartet eine Konfiguration als Übergabeparameter.

Ts

```typescript
const myConfiguration: LuxComponentsConfigParameters = {
  generateLuxTagIds: environment.generateLuxTagIds,
  displayLuxConsoleLogs: false,
  lookupServiceUrl: "/lookup/",
  labelConfiguration: {
    allUppercase: true,
    notAppliedTo: ["lux-menu-item", "lux-side-nav-item"],
  },
  cardExpansionAnimationActive: true,
  viewConfiguration: {
    centerdView: true,
    centeredWidth: '1000px',
  }
};

@NgModule({
  declarations: [
    // ...
    AppComponent,
    // ...
  ],
  imports: [
    // ...
    // Wenn keine Konfiguration mitgegeben wird, wird eine Standardkonfiguration verwendet (siehe LuxComponentsConfigService).
    LuxComponentsConfigModule.forRoot(myConfiguration),
    // ...
  ],
  providers: [
    // ...
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```
