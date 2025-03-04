# LUX-Message-Box

![Beispielbild LUX-Message-Box](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐message‐box-v18-img.png)

- [LUX-Message-Box](#lux-message-box)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Components](#components)
    - [LuxMessageComponent](#luxmessagecomponent)
      - [Allgemein](#allgemein-1)
      - [@Input](#input-1)
      - [@Output](#output-1)
  - [Classes / Interfaces](#classes--interfaces)
    - [LuxMessage](#luxmessage)
    - [ILuxMessageChangeEvent](#iluxmessagechangeevent)
    - [ILuxMessageCloseEvent](#iluxmessagecloseevent)
  - [Beispiel](#beispiel)
  - [Zusatzinformationen](#zusatzinformationen)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| import   | LuxCommonModule |
| selector | lux-message-box |

### @Input

| Name                | Typ          | Beschreibung                                                                                                                 |
| ------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| luxMessages         | LuxMessage[] | Enthält ein Array mit den einzelnen LuxMessage-Objekten. Diese werden dann genutzt, um die Nachrichten anzuzeigen.           |
| luxIndex            | number       | Bestimmt die Paginator-Page, die aktuell angezeigt werden soll. Ungültige Eingaben werden abgefangen und korrigiert.         |
| luxMaximumDisplayed | number       | Bestimmt, wie viele Nachrichten untereinander angezeigt werden. Über die Pagination sind die übrigen Nachrichten erreichbar. |
| luxGrabFocus        | boolean      | Gibt an, ob die Meldungsliste den Fokus erhält, wenn Meldungen eingeblendet werden.                                          |

### @Output

| Name                | Typ                                   | Beschreibung                                                                                                                                                                                                  |
| ------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxMessageChanged   | EventEmitter \<LuxMessageChangeEvent> | Event-Emitter, welcher beim Klick auf die Zurück- und Weiter-Buttons in der LuxMessageBoxComponent ausgelöst wird. Die Event-Payload ist ein Objekt mit der Struktur, die im Interface LuxMessageChangeEvent. |
| luxMessageClosed    | EventEmitter \<LuxMessageCloseEvent>  | Event-Emitter, welcher beim Schließen einer Nachricht ausgelöst wird. Als Event-Payload wird ein Objekt des Interfaces LuxMessageCloseEvent übermittelt.                                                      |
| luxMessageBoxClosed | EventEmitter \<void>                  | Event-Emitter, welcher beim Schließen einer der Nachrichten dieser Komponente ausgelöst wird. Das Event hat keine eigene Payload (void).                                                                      |

## Components

### LuxMessageComponent

Diese Component wird von der LuxMessageBoxComponent dazu genutzt, die einzelnen Nachrichten darzustellen.

Der Aufrufer hat keinen direkten Bezug zu dieser Component, das Erstellen der Nachrichten
erfolgt über die luxMessages-Property der LuxMessageBoxComponent.

#### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-message  |

#### @Input

| Name       | Typ        | Beschreibung                                                                 |
| ---------- | ---------- | ---------------------------------------------------------------------------- |
| luxMessage | LuxMessage | Entspricht einer Nachricht aus der darüber liegenden LuxMessageBoxComponent. |

#### @Output

| Name             | Typ                                  | Beschreibung                                                                                                                                             |
| ---------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxMessageClosed | EventEmitter \<LuxMessageCloseEvent> | Event-Emitter, welcher beim Schließen einer Nachricht ausgelöst wird. Als Event-Payload wird ein Objekt des Interfaces LuxMessageCloseEvent übermittelt. |

## Classes / Interfaces

### LuxMessage

Wird von der LuxMessageBoxComponent genutzt um einzelne Nachrichten darzustellen.

| Name     | Typ                | Beschreibung                                                                  |
| -------- | ------------------ | ----------------------------------------------------------------------------- |
| text     | string             | Bestimmt den Text, den diese spezifische Nachricht haben wird.                |
| iconName | string             | Bestimmt das Icon, welches links in der Nachrichtenbox angezeigt wird.        |
| color    | LuxMessageBoxColor | Bestimmt die Farbe der Nachrichtenbox, sobald diese Nachricht angezeigt wird. |

### ILuxMessageChangeEvent

Objekte dieses Interfaces werden beim Wechsel der angezeigten Nachrichten über die Pagination
als Event an die Aufrufer weitergegeben.

| Name         | Typ                                         | Beschreibung                                                                                                                     |
| ------------ | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| currentPage  | { index: number, messages: ILuxMessages[] } | Enthält das Objekt mit den Informationen zum aktuellen Nachrichten-Objekt. Properties: index: number und messages: LuxMessage[]  |
| previousPage | { index: number, messages: ILuxMessages[] } | Enthält das Objekt mit den Informationen zum vorherigen Nachrichten-Objekt. Properties: index: number und messages: LuxMessage[] |

### ILuxMessageCloseEvent

Objekte dieses Interfaces werden beim Schließen einer angezeigten Nachricht als Event an die Aufrufer weitergegeben.

| Name    | Typ         | Beschreibung                                                                |
| ------- | ----------- | --------------------------------------------------------------------------- |
| index   | number      | Der Index-Wert, den dieses Objekt innerhalb des luxMessages-Arrays besitzt. |
| message | ILuxMessage | Das LuxMessage-Objekt dieser Nachricht.                                     |

## Beispiel

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐message‐box-v18-img-01.png)

Ts

```typescript
messages: ILuxMessage[] = [
  {text: 'Message #1', iconName: 'lux-interface-lighting-light-bulb', color: 'green'},
  {text: 'Message #2', iconName: 'lux-interface-alert-alarm-bell-2', color: 'blue'},
  {text: 'Message #3', iconName: 'lux-folder-open', color: 'orange'},
];


logChanged($event: ILuxMessageChangeEvent) {
  console.log('[Output-Event] Message wurde geändert: ', $event);
}

logClosed($event: ILuxMessageCloseEvent) {
  console.log('[Output-Event] Message wurde geschlossen: ', $event);
}


logBoxClosed() {
  console.log('[Output-Event] MessageBox wurde geschlossen');
}
```

Html

```html
<lux-message-box
  [luxMessages]="messages"
  [luxMaximumDisplayed]="2"
  (luxMessageChanged)="logChanged($event)"
  (luxMessageClosed)="logClosed($event)"
  (luxMessageBoxClosed)="logBoxClosed()"
>
</lux-message-box>
```

## Zusatzinformationen

Allgemein
Diese Komponente zeigt eine navigierbare Reihe von Nachrichten an. Jede einzelne Nachricht besitzt einen Text und wahlweise ein Icon sowie eine Farbe (siehe LuxBackgroundColorsEnum).
Es ist außerdem möglich mehrere Reihen von Nachrichten untereinander anzuzeigen.

[lux-http-error](lux‐http‐error-v18) nutzt diese Komponente zur Darstellung von Fehlermeldungen.
