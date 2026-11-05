# LUX-Chat

![Beispielbild LUX-Chat](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐chat-v22-img.png)

- [LUX-Chat](#lux-chat)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Components](#components)
    - [LuxChatHeaderComponent](#luxchatheadercomponent)
    - [LuxChatEntryComponent](#luxchatentrycomponent)
  - [Classes / Interfaces](#classes--interfaces)
    - [LuxChatData](#luxchatdata)
    - [LuxChatMessageData](#luxchatmessagedata)
  - [Beispiele](#beispiele)
    - [1. Einfacher Chat](#1-einfacher-chat)
    - [2. Chat mit eigenem Header und eigenen Nachrichten](#2-chat-mit-eigenem-header-und-eigenen-nachrichten)

## Overview / API

### Allgemein

| Name     | Beschreibung                     |
| -------- | -------------------------------- |
| selector | lux-chat                         |
| import   | @ihk-gfi/lux-components/lux-chat |

Die Komponente zeigt den Chatverlauf von einer oder mehreren Personen sowie ein Eingabefeld für neue Nachrichten an. Nachrichten des aktiven Nutzers (`luxChatUserName`) werden rechts, alle anderen links angezeigt. Liegen zwischen zwei Nachrichten mehr als 10 Minuten oder wechselt der Nutzer, wird die Uhrzeit erneut angezeigt; bei einem neuen Tag erscheint eine Datumstrennlinie (für heute und gestern mit relativer Bezeichnung).

Neue Nachrichten verwaltet die Anwendung selbst: Die Komponente meldet Eingaben über `luxChatOutput`, die Anwendung fügt sie z.B. über `LuxChatData.addMessage()` dem Verlauf hinzu.

Für die Darstellung als Popup mit FAB-Button siehe [LUX-Chat-Popup](lux‐chat‐popup-v22).

### @Input

| Name            | Typ         | Beschreibung                                                                                                                                                                                                |
| --------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxChatData     | LuxChatData | Das Datenobjekt mit Titel, Erstellungszeitpunkt und Nachrichten des Chats (siehe [LuxChatData](#luxchatdata)).                                                                                              |
| luxChatUserName | string      | Name des aktiven Nutzers. Seine Nachrichten werden rechts und ohne Namen angezeigt.                                                                                                                         |
| luxAutoFocus    | boolean     | Gibt an, ob das Eingabefeld beim Anzeigen des Chats automatisch den Fokus erhält. Default: false.                                                                                                           |
| chatPopupMode   | boolean     | Zeigt im Standard-Header die Buttons für den Vollbildmodus und zum Schließen an. Wird von `lux-chat-popup` automatisch gesetzt. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt. |

### @Output

| Name                | Typ     | Beschreibung                                                                                                                                                    |
| ------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxChatOutput       | string  | Wird ausgelöst, wenn der Nutzer eine Eingabe mit Enter oder über den Senden-Button abschickt. Die Nachricht muss von der Anwendung in den Verlauf übernommen werden. |
| chatClose           | void    | Wird ausgelöst, wenn im Standard-Header der Schließen-Button angeklickt wird (nur bei `chatPopupMode`).                                                          |
| chatFullscreen      | boolean | Wird ausgelöst, wenn im Standard-Header der Vollbild-Button angeklickt wird, und enthält den neuen Zustand (nur bei `chatPopupMode`).                            |
| chatPopupModeChange | boolean | Wird ausgelöst, wenn sich `chatPopupMode` ändert (implizit aus dem `chatPopupMode`-Model).                                                                      |

## Components

### LuxChatHeaderComponent

Ersetzt den Standard-Header (Titel und Erstellungszeitpunkt) durch ein eigenes `ng-template`.

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-chat-header |

### LuxChatEntryComponent

Ersetzt die Standarddarstellung des Nachrichtentexts durch ein eigenes `ng-template`. Das Template erhält die jeweilige Nachricht (`LuxChatMessageData`) als `let-item`.

| Name     | Beschreibung   |
| -------- | -------------- |
| selector | lux-chat-entry |

## Classes / Interfaces

### LuxChatData

Enthält alle Daten über einen Chatverlauf.

| Name               | Typ                                | Beschreibung                                                                  |
| ------------------ | ---------------------------------- | ----------------------------------------------------------------------------- |
| title              | string                             | Titel des Chats.                                                              |
| createdAt          | Date                               | Datum, wann der Chat erstellt wurde.                                          |
| messages           | LuxChatMessageData[]               | Nachrichten Array.                                                            |
| metadata           | any                                | Metadaten für zusätzliche Informationen.                                      |
| messageAddedEvents | EventEmitter\<LuxChatMessageData\> | Gibt jede Nachricht aus, die über `addMessage()` hinzugefügt wurde.           |

| Name                                                                         | Beschreibung                                                                                                                                                  |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| constructor(title: string, createdAt: Date, messages: LuxChatMessageData[] = []) | Erzeugt einen neuen Chatverlauf.                                                                                                                              |
| addMessage(message: LuxChatMessageData): void                                | Fügt eine Nachricht dem Chatobjekt hinzu. Das Hinzufügen von Nachrichten soll hierüber erfolgen, damit die LuxChatComponent auf neue Einträge reagieren kann. |

`title`, `createdAt` und `messages` liegen intern in Signalen. Die LuxChatComponent erkennt Änderungen an derselben LuxChatData-Instanz daher auch mit OnPush, wenn diese Properties neu zugewiesen werden (z.B. `chatData.title = 'Neu'`) oder eine Nachricht über `addMessage()` hinzukommt. Ein direktes `chatData.messages.push(...)` und Änderungen innerhalb einzelner Nachrichten werden dagegen nicht erkannt.

### LuxChatMessageData

Enthält alle Daten über eine Chatnachricht.

| Name     | Typ    | Beschreibung                                    |
| -------- | ------ | ----------------------------------------------- |
| user     | string | Nutzername der diese Nachricht geschrieben hat. |
| content  | string | Inhalt der Nachricht.                           |
| time     | Date   | Zeit wann diese Nachricht geschrieben wurde.    |
| metadata | any    | Metadaten für zusätzliche Informationen.        |

Die Komponente legt in `metadata` eigene Einträge mit führendem Unterstrich ab (z.B. `_isUser`). Diese Schlüssel sollten von der Anwendung nicht verwendet werden.

## Beispiele

### 1. Einfacher Chat

Ts

```typescript
import { LuxChatComponent, LuxChatData } from '@ihk-gfi/lux-components/lux-chat';

readonly chatData = new LuxChatData('Neuer Chat', new Date(), []);

onMessageEntered(input: string) {
  this.chatData.addMessage({ user: 'Max', content: input, time: new Date(), metadata: {} });
}
```

Html

```html
<lux-chat [luxChatData]="chatData" luxChatUserName="Max" (luxChatOutput)="onMessageEntered($event)" />
```

### 2. Chat mit eigenem Header und eigenen Nachrichten

Ts

```typescript
import { LuxChatComponent, LuxChatData, LuxChatEntryComponent, LuxChatHeaderComponent } from '@ihk-gfi/lux-components/lux-chat';

readonly chatData = new LuxChatData('Support', new Date(), []);

onMessageEntered(input: string) {
  this.chatData.addMessage({ user: 'Max', content: input, time: new Date(), metadata: {} });
}
```

Html

```html
<lux-chat [luxChatData]="chatData" luxChatUserName="Max" (luxChatOutput)="onMessageEntered($event)">
  <lux-chat-header>
    <ng-template>Custom Header {{ chatData.title }}</ng-template>
  </lux-chat-header>
  <lux-chat-entry>
    <ng-template let-item>
      <p><strong>{{ item.user }}:</strong> {{ item.content }}</p>
    </ng-template>
  </lux-chat-entry>
</lux-chat>
```
