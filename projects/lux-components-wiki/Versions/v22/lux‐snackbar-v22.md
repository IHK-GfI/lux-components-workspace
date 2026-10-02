# LUX-Snackbar

![Beispielbild LUX-Snackbar](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐snackbar-v22-img.png)

- [LUX-Snackbar](#lux-snackbar)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
  - [Components](#components)
    - [LuxSnackbarComponent](#luxsnackbarcomponent)
  - [Classes / Interfaces](#classes--interfaces)
    - [LuxSnackbarConfig](#luxsnackbarconfig)
  - [Beispiele](#beispiele)
    - [1. Snackbar mit Text](#1-snackbar-mit-text)
    - [2. Snackbar mit Icon und Action](#2-snackbar-mit-icon-und-action)
  - [Zusatzinformationen](#zusatzinformationen)

## Overview / API

### Allgemein

| Name | Beschreibung       |
| ---- | ------------------ |
| name | LuxSnackbarService |

| Funktion                                                                               | Beschreibung                                                                                                                 |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| openText(message: string, duration: number, actionName?: string): void                 | Diese Methode öffnet eine Snackbar mit einem Text.                                                                           |
| openComponent(component: ComponentType\<any>, duration: number = 0, data?: any): void | Diese Methode öffnet eine Snackbar, in der die übergebene Komponente angezeigt wird. Die Komponente erhält `data` über `inject(MAT_SNACK_BAR_DATA)`. |
| open(duration: number, config?: LuxSnackbarConfig): void                               | Öffnet eine Snackbar anhand der übergebenen Konfiguration. Ermöglicht eine genaue Konfiguration der Snackbar.                |
| onAction(): Observable \<void>                                                         | Diese Methode liefert ein Observable zurück, das den Aufrufer benachrichtigt, wenn die Action in der Snackbar geklickt wird. |
| afterDismissed(): Observable \<MatSnackBarDismiss>                                     | Diese Methode liefert ein Observable zurück, welches benachrichtigt wird, sobald die Snackbar entfernt wurde.                |
| dismiss(): void                                                                        | Diese Methode blendet die Snackbar aus.                                                                                      |

## Components

### LuxSnackbarComponent

Diese Component wird von dem LuxSnackbarService dazu genutzt, eine einzelne Snackbar darzustellen (über die .open()-Funktion).

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-snackbar |

## Classes / Interfaces

### LuxSnackbarConfig

Diese Klasse ermöglicht die Konfiguration der anzuzeigenden Snackbar. Alle Properties sind optional.

| Name        | Typ                        | Beschreibung                                                                               |
| ----------- | -------------------------- | ------------------------------------------------------------------------------------------ |
| iconName? | string | Bestimmt das Icon, welches in der Snackbar angezeigt werden soll. Default: ''. |
| iconSize? | string | Setzt die (relative) Größe des Icons, z.B. '1x' bis '5x'. Default: '3x'. |
| iconColor? | LuxSnackbarColor | Bestimmt die Icon-Farbe. Mögliche Werte (Typ `LuxSnackbarColor`): `white`, `red`, `blue`, `green`, `orange`, `yellow`. Der Wert wird als CSS-Klasse umgesetzt, beliebige CSS-Farbwerte sind nicht möglich. |
| text? | string | Diese Property legt den Text der Snackbar fest. |
| textColor? | LuxSnackbarColor | Bestimmt die Text-Farbe. Mögliche Werte (Typ `LuxSnackbarColor`): `white`, `red`, `blue`, `green`, `orange`, `yellow`. Der Wert wird als CSS-Klasse umgesetzt, beliebige CSS-Farbwerte sind nicht möglich. |
| action? | string | Über diese Eigenschaft kann der Text einer Action gesetzt werden. |
| actionColor? | LuxSnackbarColor | Bestimmt die Action-Farbe. Mögliche Werte (Typ `LuxSnackbarColor`): `white`, `red`, `blue`, `green`, `orange`, `yellow`. Der Wert wird als CSS-Klasse umgesetzt, beliebige CSS-Farbwerte sind nicht möglich. |

## Beispiele

### 1. Snackbar mit Text

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐snackbar-v22-img-01.png)

Ts

```typescript
private readonly snackbar = inject(LuxSnackbarService);

openSnackbar() {
  this.snackbar.openText(
    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, ' +
      'sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat',
    6000
  );
}
```

Html

```html
<lux-button luxLabel="Snackbar öffnen" (luxClicked)="openSnackbar()" />
```

### 2. Snackbar mit Icon und Action

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐snackbar-v22-img-02.png)

Ts

```typescript
private readonly snackbar = inject(LuxSnackbarService);

openSnackbar() {
  this.snackbar.open(2000, {
    text: 'Es sind neue Informationen verfügbar.',
    textColor: 'white',
    iconName: 'lux-info',
    iconSize: '2x',
    iconColor: 'green',
    action: 'Schließen',
    actionColor: 'blue'
  });
}
```

Html

```html
<lux-button luxLabel="Snackbar öffnen" (luxClicked)="openSnackbar()" />
```

## Zusatzinformationen

Die Snackbar ermöglicht es, den Benutzer wichtige Nachrichten anzuzeigen. Diese Nachrichten legen sich über den eigentlichen Inhalt der Seite (siehe Beispiele oben).

Bitte die Snackbar nur sparsam einsetzen, z.B. um dem Benutzer eine Bestätigung (z.B. Vielen Dank! Ihr Antrag wurde erfolgreich übermittelt) anzuzeigen. Die Snackbar sollte sich entweder nach einer gewissen Zeit selbst ausblenden oder eine Schaltfläche beinhalten, welche die Snackbar automatisch schließt, wenn diese geklickt wurde.
