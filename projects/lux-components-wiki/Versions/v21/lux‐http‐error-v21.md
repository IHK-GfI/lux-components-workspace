# LUX-Http-Error

![Beispielbild LUX-Http-Error](lux‐http‐error-v21-img.png)

- [LUX-Http-Error](#lux-http-error)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
  - [Beispiele](#beispiele)
    - [1. LuxHttpErrorInterceptors](#1-luxhttperrorinterceptors)
    - [2. Fehler pushen](#2-fehler-pushen)

## Overview / API

### Allgemein

Komponente die zur Darstellung von HTTP-Fehlern genutzt werden kann.

Dafür muss der Tag lux-http-error in die eigene View eingebaut werden und der LuxHttpErrorInterceptor im AppModule eingetragen werden.
Wahlweise ist es auch möglich, über den LuxHttpErrorInterceptor eigene Fehler zu pushen, welche dann von dem LuxHttpErrorComponent dargestellt werden.

LuxHttpErrorComponent benutzt die [lux-message-box](lux‐message‐box-v21) zur Darstellung der Meldungen.

| Name     | Beschreibung   |
| -------- | -------------- |
| selector | lux-http-error |

## Beispiele

### 1. LuxHttpErrorInterceptors

![Beispielbild 01](lux‐http‐error-v21-img-01.png)

Ts

```typescript
constructor() {
    // eigentlich fängt der Interceptor selbstständig 400er Fehler von Backendcalls ab, aber für das Beispiel tun wir das manuell.
    LuxHttpErrorInterceptor.dataStream.next([
      ['Der Nachname darf nicht leer sein.'],
      ['Die ID existiert nicht.'],
      ['Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam' +
      ' nonumy eirmod tempor inviduntutlaboreetdolore magna aliquyam erat, ' +
      'sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.']
    ]);
  }
```

Html

```html
<lux-http-error></lux-http-error>
```

### 2. Fehler pushen

![Beispielbild 02](lux‐http‐error-v21-img-02.png)

Ts

```typescript
onShowError() {
    // z.B. als String-Array
    LuxHttpErrorInterceptor.dataStream.next(['Fehler 1', 'Fehler 2']);
    // z.B. als Object mit .message-Property
    LuxHttpErrorInterceptor.dataStream.next([{
        message: 'Fehler 1'
    }, {
        message: 'Fehler 2'
    }]);
    // z.B. als Object mit .toString()-Funktion
    LuxHttpErrorInterceptor.dataStream.next([{
        toString: () => 'Fehler 1'
    }, {
        toString: () => 'Fehler 2'
    }]);
}
```

Html

```html
<lux-http-error></lux-http-error>
<lux-button
  luxLabel="Fehler anzeigen"
  [luxStroked]="true"
  (luxClicked)="onShowError()"
></lux-button>
```
