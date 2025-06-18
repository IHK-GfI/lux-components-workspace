# luxBadgeNotification

![Beispielbild LUX-Badge-Notification](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/luxBadgeNotification-v19-img.png)

- [luxBadgeNotification](#luxbadgenotification)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiel](#beispiel)

## Overview / API

### Allgemein

| Name     | Beschreibung                                 |
| -------- | -------------------------------------------- |
| selector | lux-badge-notification, luxBadgeNotification |

### @Input

| Name                 | Typ                          | Beschreibung                                                                                                                                                                                                                                                                                     |
| -------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxBadgeNotification | string                       | Enthält die Bezeichnung, die in der Notification angezeigt werden soll. Diese sollte nicht mehr als 3 Zeichen beinhalten.                                                                                                                                                                        |
| luxBadgeColor        | LuxBadgeNotificationColor    | Stellt die Farbe der Notification an.                                                                                                                                                                                                                                                            |
| luxBadgeSize         | LuxBadgeNotificationSize     | Stellt die Größe der Badge und ihrer Font ein.                                                                                                                                                                                                                                                   |
| luxBadgePosition     | LuxBadgeNotificationPosition | Bestimmt an welcher Stelle die Notification dargestellt werden soll.                                                                                                                                                                                                                             |
| luxBadgeDisabled     | boolean                      | Dieser Flag deaktiviert die Notification.                                                                                                                                                                                                                                                        |
| luxBadgeHidden       | boolean                      | Dieser Flag blendet die Notification aus.                                                                                                                                                                                                                                                        |
| luxBadgeOverlap      | boolean                      | Dieser Flag legt fest ob die Notification neben oder über dem Host-Element liegen soll.                                                                                                                                                                                                          |
| luxBadgeCap          | number                       | Diese Property bestimmt ob der eingegebene Wert nach einem bestimmten Zahlenwert mithilfe eines "+"-Zeichens abgekürzt werden soll. Voraussetzung dafür ist, das luxBadgeNotification in eine number konvertiert werden kann. Bsp: luxBadgeCap = 10, luxBadgeNotification = "11", output = "10+" |
| luxBadgeNoBorder     | boolean                      | Diese Property bestimmt ob die Border transparent dargestellt wird.                                                                                                                                                                                                                              |

## Beispiel

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/luxBadgeNotification-v19-img-01.png)

Html

```html
<span
  [luxBadgeOverlap]="false"
  luxBadgeNotification="1"
  luxBadgeColor="warn"
  luxBadgeSize="large"
>
  Span
</span>
```
