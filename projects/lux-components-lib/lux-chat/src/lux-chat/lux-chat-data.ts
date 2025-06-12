import { EventEmitter } from "@angular/core";
import { LuxChatControlRef } from "./lux-chat-control-ref";
import { LuxChatDataEntry } from "./lux-chat-data-entry";
import { Subject } from "rxjs";

export class LuxChatData implements LuxChatControlRef {

    private chatControlRef?: LuxChatControlRef;
    public data: LuxChatDataEntry[] = [];

    public metadata: any;

    private chatDataUpdate: EventEmitter<LuxChatDataEntry> = new EventEmitter<LuxChatDataEntry>();

    constructor(public title: string, public created_at: Date){}

    get chat(): LuxChatData | undefined {
        return this;
    }

    get userName(): string {
        return this.chatControlRef?.userName || "";
    }

    public initControl(chatControlRef: LuxChatControlRef){
        this.chatControlRef = chatControlRef;
    }

    addChatEntry(userName: string, content: string, time: Date, smoothScrolling = true): LuxChatDataEntry {
        const chatEntry = new LuxChatDataEntry(this, userName, content, time);
        this.data.push(chatEntry);
        this.chatDataUpdate.emit(chatEntry);

        this.scrollToBottom(smoothScrolling);

        return chatEntry;
    }

    scrollToBottom(smoothScrolling = true) {
        this.chatControlRef?.scrollToBottom(smoothScrolling);
    }

    scrollToBottomForced(smoothScrolling = true) {
        this.chatControlRef?.scrollToBottomForced(smoothScrolling);
    }

    get chatDataOut() : Subject<LuxChatDataEntry> {
        return this.chatDataUpdate;
    }

}