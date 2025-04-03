# LUX-Snackbar

![Beispielbild LUX-Snackbar](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐snackbar-v18-img.png)

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

| Name   | Beschreibung       |
| ------ | ------------------ |
| name   | LuxSnackbarService |

| Funktion                                                                               | Beschreibung                                                                                                                 |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| openText(message: string, duration: number, actionName?: string): void                 | Diese Methode öffnet eine Snackbar mit einem Text.                                                                           |
| openComponent(component: ComponentType:\<any>, duration: number = 0, data?: any): void | Diese Methode öffnet eine Snackbar, in der die übergebene Komponente angezeigt wird.                                         |
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

Diese Klasse ermöglicht die Konfiguration der anzuzeigenden Snackbar.

| Name        | Typ                        | Beschreibung                                                                               |
| ----------- | -------------------------- | ------------------------------------------------------------------------------------------ |
| iconName    | string                     | Bestimmt das Icon, welches in der Snackbar angezeigt werden soll.                          |
| iconSize    | 1x \| 2x \| 3x \| 4x \| 5x | Setzt die (relative) Größe des Icons.                                                      |
| iconColor   | string                     | Bestimmt die Icon-Farbe (beliebiger CSS-Farbwert eintragbar). Bestimmt die Icon-Farbe.     |
| text        | string                     | Diese Property legt den Text der Snackbar fest.                                            |
| textColor   | string                     | Bestimmt die Text-Farbe (beliebiger CSS-Farbwert eintragbar). Bestimmt die Text-Farbe.     |
| action      | string                     | Über diese Eigenschaft kann der Text einer Action gesetzt werden.                          |
| actionColor | stringF                    | Bestimmt die Action-Farbe (beliebiger CSS-Farbwert eintragbar). Bestimmt die Action-Farbe. |

## Beispiele

### 1. Snackbar mit Text

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐snackbar-v18-img-01.png)

Ts

```typescript
constructor(private snackbar: LuxSnackbarService) {
    this.snackbar.openText('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, ' +
    'sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat', 6000);
}
```

### 2. Snackbar mit Icon und Action

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐snackbar-v18-img-02.png)

Ts

```typescript
constructor(private snackbar: LuxSnackbarService) {
    this.snackbar.open(2000, {
        text: 'Es sind neue Informationen verfügbar.',
        textColor: 'gray',
        iconName: 'lux-info',
        iconSize: '2x',
        iconColor: 'green',
        action: 'Schließen',
        actionColor: 'blue'
    });
}
```

## Zusatzinformationen

Die Snackbar ermöglicht es, den Benutzer wichtige Nachrichten anzuzeigen. Diese Nachrichten legen sich über den eigentlichen Inhalt der Seite (Beispiele gibt es weiter unten im Text).

Bitte die Snackbar nur sparsam einsetzen, z.B. um dem Benutzer eine Bestätigung (z.B. Vielen Dank! Ihr Antrag wurde erfolgreich übermittelt) anzuzeigen. Die Snackbar sollte sich entweder nach einer gewissen Zeit selbst ausblenden oder eine Schaltfläche beinhalten, welche die Snackbar automatisch schließt, wenn diese geklickt wurde.
