# LUX-Error-Page

![Beispielbild LUX-Error-Page](lux‐error‐page-v19-img.png)

- [LUX-Error-Page](#lux-error-page)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
  - [Services](#services)
    - [LuxErrorService](#luxerrorservice)
    - [LuxErrorStoreService](#luxerrorstoreservice)
  - [Classes / Interfaces](#classes--interfaces)
    - [ILuxError](#iluxerror)
    - [ILuxErrorPageConfig](#iluxerrorpageconfig)
  - [Beispiel](#beispiel)

## Overview / API

### Allgemein

| Name     | Beschreibung   |
| -------- | -------------- |
| selector | lux-error-page |

## Services

### LuxErrorService

Der LuxErrorService steuert den Aufruf und die Konfiguration der LuxErrorPage. Diese wird nicht im klassischen Sinne in einem Template eingebaut.

Vorgehen um die Lux-Error-Page aufzurufen:

- LuxErrorService in Providers eintragen
- (Optional) über den LuxErrorService die Konfiguration (siehe ILuxErrorPageConfig) anpassen
- Die Fehlerseite über die Funktion navigateToErrorPage des LuxErrorService aufrufen

### LuxErrorStoreService

Dieser Service speichert die aktuellen und letzten übergebenen Fehlermeldungen des LuxErrorService sowie die aktuelle und die Standard-Konfiguration für die LuxErrorPageComponent.

Der LuxErrorService und die LuxErrorPageComponent nutzen diesen Service um Informationen auszutauschen.

## Classes / Interfaces

### ILuxError

Objekte, die das Interface ILuxError implementieren werden von der LuxErrorPageComponent benutzt, um die Fehlermeldungen darzustellen.

| Name         | Typ    | Beschreibung                                                                        |
| ------------ | ------ | ----------------------------------------------------------------------------------- |
| errorId      | any    | Die ID dieser Fehlermeldung (wird über dem Panel mit der errorMessage dargestellt). |
| errorMessage | string | Die Fehlermeldung, die in der Component dargestellt werden soll.                    |

### ILuxErrorPageConfig

| Name                | Typ                                  | Beschreibung                                                                                                                                                                                                 |
| ------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| iconName?           | string                               | Bestimmt das Icon, welches über der Fehlermeldung dargestellt werden soll.                                                                                                                                   |
| iconSize?           | '1x' \| '2x' \| '3x' \| '4x' \| '5x' | Bestimmt wie groß das Icon dargestellt werden soll.                                                                                                                                                          |
| errorText?          | string                               | Bestimmt den Text, der oberhalb der eigentlichen Fehlermeldungen angezeigt wird und kennzeichnen soll, dass ein Fehler aufgetreten ist.                                                                      |
| homeRedirectText?   | string                               | Enthält den Text, der für den Redirect-Link zurück zur Home-Page benutzt wird.                                                                                                                               |
| homeRedirectUrl?    | string                               | Definiert die URL, die vom Redirect-Link benutzt werden soll.                                                                                                                                                |
| errorPageUrl?       | string                               | Bestimmt die URL für die LuxErrorPageComponent.                                                                                                                                                              |
| skipLocationChange? | boolean                              | Bestimmt, ob beim Aufruf der Fehlerseite eine Änderung in der aktuellen URL der Webapplikation durchgeführt werden soll. Wenn false, bleibt die aktuelle URL bestehen obwohl die Fehlerseite angezeigt wird. |

## Beispiel

![Beispielbild 01](lux‐error‐page-v19-img-01.png)

Ts

```typescript
constructor(private errorService: LuxErrorService) {
    // Das ist optional, es wird ansonst eine Standard-Konfiguration gewählt. Die einzelnen Felder sind ebenfalls alle optional.
    this.errorService.setConfig({
        iconName: 'lux-interface-delete-1',
        iconSize: '3x',
        errorText: 'Uups... da ist etwas schief gelaufen. Wir kennen die Fehlerdetails bereits und kümmern uns darum.',
        homeRedirectText: 'Zurück zur Startseite',
        homeRedirectUrl: '/home'
    });
}


// Eine Fehlerquelle kann nun die Funktion aufrufen und so die LuxErrorPageComponent aufrufen
onError() {
    this.errorService.navigateToErrorPage({errorId: '12345', errorMessage: 'Fehler XY'});
}
```

Html

```html
<lux-button luxLabel="Error-Page" (luxClicked)="onError()"></lux-button>
```
