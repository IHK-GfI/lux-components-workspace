import { EventEmitter, signal, WritableSignal } from '@angular/core';
import { LuxChatMessageData } from './lux-chat-message-data';

/**
 * Enthält alle Daten über einen Chatverlauf.
 *
 * title, createdAt und messages liegen intern in Signals. Dadurch bemerkt die LuxChatComponent (OnPush)
 * jede Zuweisung (z.B. `chatData.title = 'Neu'` oder `chatData.messages = [...]`) und jedes addMessage(),
 * auch wenn dieselbe LuxChatData-Instanz gebunden bleibt. Ein direktes `messages.push(...)` ändert das
 * Array dagegen still - neue Nachrichten daher über addMessage() hinzufügen.
 */
export class LuxChatData {
  public metadata: any = {};

  public messageAddedEvents = new EventEmitter<LuxChatMessageData>();

  private readonly _title: WritableSignal<string>;
  private readonly _createdAt: WritableSignal<Date>;
  private readonly _messages: WritableSignal<LuxChatMessageData[]>;

  constructor(title: string, createdAt: Date, messages: LuxChatMessageData[] = []) {
    this._title = signal(title);
    this._createdAt = signal(createdAt);
    this._messages = signal(messages);
  }

  public get title(): string {
    return this._title();
  }

  public set title(title: string) {
    this._title.set(title);
  }

  public get createdAt(): Date {
    return this._createdAt();
  }

  public set createdAt(createdAt: Date) {
    this._createdAt.set(createdAt);
  }

  public get messages(): LuxChatMessageData[] {
    return this._messages();
  }

  public set messages(messages: LuxChatMessageData[]) {
    this._messages.set(messages);
  }

  public addMessage(message: LuxChatMessageData): void {
    // Neues Array statt push(), damit das Signal die Änderung meldet
    this._messages.update((messages) => [...messages, message]);
    this.messageAddedEvents.emit(message);
  }

  /**
   * Serialisiert wie bisher mit title, createdAt, messages und metadata. Ohne diese Methode würde
   * JSON.stringify() die Getter nicht berücksichtigen und stattdessen die internen Signals ausgeben.
   */
  public toJSON(): { title: string; createdAt: Date; messages: LuxChatMessageData[]; metadata: any } {
    return { title: this.title, createdAt: this.createdAt, messages: this.messages, metadata: this.metadata };
  }
}
