# LUX-Error-Page

![Beispielbild LUX-Error-Page](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐error‐page-v22-img.png)

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

Der Service ist `providedIn: 'root'` und muss nicht in den Providers eingetragen werden. Beim Erzeugen und bei jedem Aufruf von `setConfig()` trägt er die Route zur Fehlerseite (`errorPageUrl`, Default `errorpage`) selbst in die Router-Konfiguration ein.

Vorgehen um die LUX-Error-Page aufzurufen:

- (Optional) über den LuxErrorService die Konfiguration (siehe ILuxErrorPageConfig) anpassen
- Die Fehlerseite über die Funktion navigateToErrorPage des LuxErrorService aufrufen

| Funktion                                                 | Beschreibung                                                                                                                                         |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| setConfig(config: ILuxErrorPageConfig \| null): void     | Setzt die Konfiguration der Fehlerseite (fehlende Werte werden aus der Standard-Konfiguration ergänzt, `null` = Standard) und registriert die Route. |
| navigateToErrorPage(error?: ILuxError): Observable\<any> | Speichert den übergebenen Fehler und navigiert zur Fehlerseite.                                                                                      |

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

| Name                | Typ                                  | Beschreibung                                                                                                                                                                                                                |
| ------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| iconName?           | string                               | Bestimmt das Icon, welches über der Fehlermeldung dargestellt werden soll. Default: 'lux-interface-delete-2'.                                                                                                               |
| iconSize?           | '1x' \| '2x' \| '3x' \| '4x' \| '5x' | Bestimmt wie groß das Icon dargestellt werden soll. Default: '5x'.                                                                                                                                                          |
| errorText?          | string                               | Bestimmt den Text, der oberhalb der eigentlichen Fehlermeldungen angezeigt wird und kennzeichnen soll, dass ein Fehler aufgetreten ist. Default: 'Es ist ein Fehler aufgetreten'.                                           |
| homeRedirectText?   | string                               | Enthält den Text, der für den Redirect-Link zurück zur Home-Page benutzt wird. Default: 'Zurück zur Startseite'.                                                                                                            |
| homeRedirectUrl?    | string                               | Definiert die URL, die vom Redirect-Link benutzt werden soll. Default: ''.                                                                                                                                                  |
| errorPageUrl?       | string                               | Bestimmt die URL für die LuxErrorPageComponent. Default: 'errorpage'.                                                                                                                                                       |
| skipLocationChange? | boolean                              | Bestimmt, ob beim Aufruf der Fehlerseite eine Änderung in der aktuellen URL der Webapplikation durchgeführt werden soll. Wenn false, bleibt die aktuelle URL bestehen obwohl die Fehlerseite angezeigt wird. Default: true. |

## Beispiel

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐error‐page-v22-img-01.png)

Ts

```typescript
private readonly errorService = inject(LuxErrorService);

constructor() {
  // Das ist optional, es wird ansonsten eine Standard-Konfiguration gewählt. Die einzelnen Felder sind ebenfalls alle optional.
  this.errorService.setConfig({
    iconName: 'lux-interface-alert-warning-diamond',
    iconSize: '3x',
    errorText: 'Uups... da ist etwas schief gelaufen. Wir kennen die Fehlerdetails bereits und kümmern uns darum.',
    homeRedirectText: 'Zurück zur Startseite',
    homeRedirectUrl: '/home'
  });
}

// Eine Fehlerquelle kann nun die Funktion aufrufen und so die LuxErrorPageComponent aufrufen
onError() {
  this.errorService.navigateToErrorPage({ errorId: '12345', errorMessage: 'Fehler XY' });
}
```

Html

```html
<lux-button luxLabel="Error-Page" (luxClicked)="onError()" />
```
