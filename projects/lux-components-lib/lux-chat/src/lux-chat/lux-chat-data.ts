import { LuxChatControlRef } from "./lux-chat-control-ref";
import { LuxChatDataEntry } from "./lux-chat-data-entry";

export class LuxChatData implements LuxChatControlRef {

    private chatControlRef?: LuxChatControlRef;
    public data: LuxChatDataEntry[] = [];

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

        this.scrollToBottom(smoothScrolling);

        return chatEntry;
    }

    scrollToBottom(smoothScrolling = true) {
        this.chatControlRef?.scrollToBottom(smoothScrolling);
    }

    scrollToBottomForced(smoothScrolling = true) {
        this.chatControlRef?.scrollToBottomForced(smoothScrolling);
    }

}