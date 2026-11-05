# LUX-Message-Box

![Beispielbild LUX-Message-Box](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐message‐box-v22-img.png)

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
    - [ILuxMessage](#iluxmessage)
    - [ILuxMessageChangeEvent](#iluxmessagechangeevent)
    - [ILuxMessageCloseEvent](#iluxmessagecloseevent)
  - [Beispiel](#beispiel)
  - [Zusatzinformationen](#zusatzinformationen)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-message-box |

### @Input

| Name                | Typ          | Beschreibung                                                                                                                 |
| ------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| luxMessages | ILuxMessage[] | Enthält ein Array mit den einzelnen ILuxMessage-Objekten. Diese werden dann genutzt, um die Nachrichten anzuzeigen. Beim Schließen einer Nachricht wird ein neues Array ohne diese Nachricht gesetzt; Two-Way-Binding über `[(luxMessages)]` möglich. Default: []. |
| luxIndex | number | Bestimmt die Paginator-Page, die aktuell angezeigt werden soll. Ungültige Eingaben werden abgefangen und korrigiert. Two-Way-Binding über `[(luxIndex)]` möglich. Default: 0. |
| luxMaximumDisplayed | number | Bestimmt, wie viele Nachrichten untereinander angezeigt werden. Über die Pagination sind die übrigen Nachrichten erreichbar. Two-Way-Binding über `[(luxMaximumDisplayed)]` möglich. Default: 1. |
| luxGrabFocus | boolean | Gibt an, ob die Meldungsliste den Fokus erhält, wenn Meldungen eingeblendet werden. Default: false. |

### @Output

| Name                | Typ                   | Beschreibung                                                                                                                                                                                           |
| ------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxMessageChanged | ILuxMessageChangeEvent | Output, welcher beim Klick auf die Zurück- und Weiter-Buttons in der LuxMessageBoxComponent ausgelöst wird. Die Event-Payload ist ein Objekt vom Typ ILuxMessageChangeEvent. |
| luxMessageClosed | ILuxMessageCloseEvent | Output, welcher beim Schließen einer Nachricht ausgelöst wird. Als Event-Payload wird ein Objekt vom Typ ILuxMessageCloseEvent übermittelt. |
| luxMessageBoxClosed | void | Output, welcher ausgelöst wird, wenn die letzte Nachricht geschlossen wurde bzw. keine Nachrichten mehr angezeigt werden. Das Event hat keine eigene Payload (void). |
| luxMessagesChange | ILuxMessage[] | Wird ausgelöst, wenn sich luxMessages ändert (Grundlage von `[(luxMessages)]`). |
| luxIndexChange | number | Wird ausgelöst, wenn sich luxIndex ändert (Grundlage von `[(luxIndex)]`). |
| luxMaximumDisplayedChange | number | Wird ausgelöst, wenn sich luxMaximumDisplayed ändert (Grundlage von `[(luxMaximumDisplayed)]`). |

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
| luxMessage | ILuxMessage | Entspricht einer Nachricht aus der darüber liegenden LuxMessageBoxComponent. |

#### @Output

| Name             | Typ                  | Beschreibung                                                                                                                                      |
| ---------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxMessageClosed | ILuxMessage | Output, welcher beim Schließen einer Nachricht ausgelöst wird. Als Event-Payload wird die geschlossene Nachricht (ILuxMessage) übermittelt. |

## Classes / Interfaces

### ILuxMessage

Wird von der LuxMessageBoxComponent genutzt um einzelne Nachrichten darzustellen.

| Name     | Typ                | Beschreibung                                                                  |
| -------- | ------------------ | ----------------------------------------------------------------------------- |
| text     | string             | Bestimmt den Text, den diese spezifische Nachricht haben wird.                |
| iconName? | string | Bestimmt das Icon, welches links in der Nachrichtenbox angezeigt wird. |
| color? | LuxMessageBoxColor | Bestimmt die Farbe der Nachrichtenbox, sobald diese Nachricht angezeigt wird. Mögliche Werte: `white`, `blue`, `red`, `green`, `gray`, `orange`, `yellow`, `purple`. |

### ILuxMessageChangeEvent

Objekte dieses Interfaces werden beim Wechsel der angezeigten Nachrichten über die Pagination
als Event an die Aufrufer weitergegeben.

| Name         | Typ                                         | Beschreibung                                                                                                                     |
| ------------ | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| currentPage | { index: number, messages: ILuxMessage[] } | Enthält das Objekt mit den Informationen zur aktuellen Seite (index und die angezeigten Nachrichten). |
| previousPage | { index: number, messages: ILuxMessage[] } | Enthält das Objekt mit den Informationen zur vorherigen Seite (index und die angezeigten Nachrichten). |

### ILuxMessageCloseEvent

Objekte dieses Interfaces werden beim Schließen einer angezeigten Nachricht als Event an die Aufrufer weitergegeben.

| Name    | Typ         | Beschreibung                                                                |
| ------- | ----------- | --------------------------------------------------------------------------- |
| index   | number      | Der Index-Wert, den dieses Objekt innerhalb des luxMessages-Arrays besitzt. |
| message | ILuxMessage | Das ILuxMessage-Objekt dieser Nachricht. |

## Beispiel

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐message‐box-v22-img-01.png)

Ts

```typescript
readonly messages: ILuxMessage[] = [
  { text: 'Message #1', iconName: 'lux-interface-lighting-light-bulb', color: 'green' },
  { text: 'Message #2', iconName: 'lux-interface-alert-alarm-bell-2', color: 'blue' },
  { text: 'Message #3', iconName: 'lux-folder-open', color: 'orange' }
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
/>
```

## Zusatzinformationen

Allgemein
Diese Komponente zeigt eine navigierbare Reihe von Nachrichten an. Jede einzelne Nachricht besitzt einen Text und wahlweise ein Icon sowie eine Farbe (Typ `LuxMessageBoxColor`).
Es ist außerdem möglich, mehrere Reihen von Nachrichten untereinander anzuzeigen.

[lux-http-error](lux‐http‐error-v22) nutzt diese Komponente zur Darstellung von Fehlermeldungen.
