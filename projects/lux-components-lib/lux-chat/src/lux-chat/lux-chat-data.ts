import { LuxChatMessageData } from "./lux-chat-message-data";
import { EventEmitter } from '@angular/core';

export class LuxChatData {
    public metadata: any = {};

    public messageAddedEvents = new EventEmitter<LuxChatMessageData>();

    public scrollHandler?: () => void;

    constructor(public title: string, public createdAt: Date, public messages: LuxChatMessageData[] = []){}

    public addMessage(message: LuxChatMessageData): void {
        this.messages.push(message);
        this.messageAddedEvents.emit(message);
    }

    public scrollToBottom(){
        if(this.scrollHandler){
            this.scrollHandler();
        }
    }
}