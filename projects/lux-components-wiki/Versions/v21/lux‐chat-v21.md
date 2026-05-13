# Lux-Chat

![Beispielbild Lux-Chat](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐chat-v21-img.png)

- [Lux-Chat](#lux-chat)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Classes / Data](#classes--data)
    - [LuxChatData](#luxchatdata)
    - [LuxChatMessageData](#luxchatmessagedata)
  - [Beispiele](#beispiele)
    - [1. Einfacher Chat](#1-einfacher-chat)


## Overview / API

### Allgemein

| Name       | Beschreibung                                        |
| ---------- | --------------------------------------------------- |
| Komponente | LuxChat                                             |
| Zweck      | Anzeigen eines Chats von ein oder mehreren Personen |

### @Input

| Name            | Typ         | Beschreibung                                                                    |
| --------------- | ----------- | ------------------------------------------------------------------------------- |
| luxChatData     | LuxChatData | Das Datenobjekt für die Chat Daten.                                             |
| luxChatUserName | string      | Namen für den aktiven Nutzer, der rechts in den Chatnachrichten angezeigt wird. |

### @Output

| Name          | Typ                    | Beschreibung                                                                                       |
| ------------- | ---------------------- | -------------------------------------------------------------------------------------------------- |
| luxChatOutput | EventEmitter\<string\> | EventEmitter für Chateingaben. Chateingaben müssen von dem Nutzer der Komponente verwaltet werden. |

## Classes / Data

### LuxChatData

Enthält alle Daten über einen Chatverlauf.

| Name      | Typ                  | Beschreibung                            |
| --------- | -------------------- | --------------------------------------- |
| title     | string               | Titel des Chats.                        |
| createdAt | Date                 | Datum, wann der Chat erstellt wurde.    |
| messages  | LuxChatMessageData[] | Nachrichten Array.                      |
| metadata  | any                  | Metadaten für zusätliche Informationen. |


| Name                                          | Beschreibung                                                                                                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| addMessage(message: LuxChatMessageData): void | Fügt eine Nachricht dem Chatobjekt hinzu. Das Hinzufügen von Nachrichten soll hierüber erfolgen, damit die LuxChatComponent auf neue Einträge reagieren kann. |

### LuxChatMessageData

Enhält alle Daten über eine Chatnachricht

| Name     | Typ    | Beschreibung                                    |
| -------- | ------ | ----------------------------------------------- |
| user     | string | Nutzername der diese Nachricht geschrieben hat. |
| content  | string | Inhalt der Nachricht.                           |
| time     | Date   | Zeit wann diese Nachricht geschrieben wurde.    |
| metadata | any    | Metadaten für zusätliche Informationen.         |

## Beispiele

### 1. Einfacher Chat

Ts

```typecript
chatData: LuxChatData = new LuxChatData("Neuer Chat", new Date(), []);

public onMessageEntered(input: string) {
    this.chatData.addMessage({user: 'Max', content: input, time: new Date(), metadata: {}})
}
```

Html

```html
<lux-chat
  [luxChatData]="chatData"
  [luxChatUserName]="'Max'"
  (luxChatOutput)="onMessageEntered($event)"
></lux-checkbox-ac>
```