# LUX-Chat-Popup

![Beispielbild 01 LUX-Chat-Popup](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐chat‐popup-v22-img-01.png)

![Beispielbild 02 LUX-Chat-Popup](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐chat‐popup-v22-img-02.png)

- [LUX-Chat-Popup](#lux-chat-popup)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Einfacher Chat Popup](#1-einfacher-chat-popup)

## Overview / API

### Allgemein

| Name     | Beschreibung                     |
| -------- | -------------------------------- |
| selector | lux-chat-popup                   |
| import   | @ihk-gfi/lux-components/lux-chat |

Die Komponente zeigt einen FAB-Button an, über den ein [LUX-Chat](lux‐chat-v22) in einem typischen Popup-Fenster geöffnet und geschlossen wird. Der Chat wird per Content-Projection übergeben. Die Komponente schaltet am Chat automatisch `chatPopupMode` ein, sodass im Standard-Header des Chats die Buttons für den Vollbildmodus und zum Schließen erscheinen, und reagiert auf deren Events. Auf kleinen Bildschirmen (xs, sm) wird das Popup immer im Vollbild dargestellt.

### @Input

| Name          | Typ     | Beschreibung                                                                                  |
| ------------- | ------- | --------------------------------------------------------------------------------------------- |
| luxChatOpened | boolean | Gibt an, ob das Chatfenster geöffnet ist. Two-Way-Binding über `[(luxChatOpened)]` möglich. Default: false. |
| luxFullScreen | boolean | Gibt an, ob das Chatfenster im Vollbild angezeigt wird. Two-Way-Binding über `[(luxFullScreen)]` möglich. Default: false. |

### @Output

| Name                | Typ     | Beschreibung                                                                                        |
| ------------------- | ------- | --------------------------------------------------------------------------------------------------- |
| luxChatOpenedChange | boolean | Wird ausgelöst, wenn das Chatfenster geöffnet oder geschlossen wird (implizit aus dem `luxChatOpened`-Model). |
| luxFullScreenChange | boolean | Wird ausgelöst, wenn der Vollbildmodus umgeschaltet wird (implizit aus dem `luxFullScreen`-Model).   |

## Beispiele

### 1. Einfacher Chat Popup

Ts

```typescript
import { LuxChatComponent, LuxChatData, LuxChatPopupComponent } from '@ihk-gfi/lux-components/lux-chat';

readonly chatOpened = signal(false);
readonly chatData = new LuxChatData('Neuer Chat', new Date(), []);

onMessageEntered(input: string) {
  this.chatData.addMessage({ user: 'Max', content: input, time: new Date(), metadata: {} });
}
```

Html

```html
<lux-chat-popup [(luxChatOpened)]="chatOpened">
  <lux-chat [luxChatData]="chatData" luxChatUserName="Max" (luxChatOutput)="onMessageEntered($event)" />
</lux-chat-popup>
```
