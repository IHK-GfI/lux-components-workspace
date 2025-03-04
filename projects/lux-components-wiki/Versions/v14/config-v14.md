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
      - [Layout](#layout)
        - [cardRow](#cardrow)
        - [formRow](#formrow)
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
| lookupServiceUrl?             | string  | Bestimmt die URL des Lookup-Services für die LookupComponents.                                                                                                                              |
| labelConfiguration?           | Object  | Bestimmt, ob die Labels für LuxButtons, LuxLinks, LuxMenuItems, LuxStepper, LuxSideNavItem und LuxTabs immer Uppercase dargestellt werden. Siehe [labelConfiguration](#labelconfiguration). |
| cardExpansionAnimationActive? | boolean | Flag, um die Ausklappanimationen von LuxCards zu aktivieren bzw. zu deaktivieren.                                                                                                           |
| rippleConfiguration?          | Object  | Bestimmt die globalen Einstellungen für die Animationen der LuxRipple-Direktiven. Siehe [rippleConfiguration](#rippleconfiguration).                                                        |
| iconBasePath?                 | string  | Bestimmt den Basepfad der LUX-Icons.                                                                                                                                                        |

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

#### Layout

##### cardRow

| Property   | Typ                                                                     | Beschreibung                                    |
| ---------- | ----------------------------------------------------------------------- | ----------------------------------------------- |
| wrapAt?    | 'none', 'xs', 'sm', 'md', 'lg', 'xl'                                    | Gibt an, ab welcher Auflösung umgebrochen wird. |
| luxGap?    | [LuxLayoutRowGapConfig](lux‐layout‐card‐row-v14#classes--interfaces)    | Abstand zwischen den Elementen.                 |
| luxMargin? | [LuxLayoutRowMarginConfig](lux‐layout‐card‐row-v14#classes--interfaces) | Abstand der Zeile nach links und rechts.        |

##### formRow

| Property   | Typ                                                                     | Beschreibung                                    |
| ---------- | ----------------------------------------------------------------------- | ----------------------------------------------- |
| wrapAt?    | 'none', 'xs', 'sm', 'md', 'lg', 'xl'                                    | Gibt an, ab welcher Auflösung umgebrochen wird. |
| luxGap?    | [LuxLayoutRowGapConfig](lux‐layout‐form‐row-v14#classes--interfaces)    | Abstand zwischen den Elementen.                 |
| luxMargin? | [LuxLayoutRowMarginConfig](lux‐layout‐form‐row-v14#classes--interfaces) | Abstand der Zeile nach links und rechts.        |

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
