import { LuxChatControlRef } from "./lux-chat-control-ref";
import { LuxChatDataEntry } from "./lux-chat-data-entry";

export class LuxChatData implements LuxChatControlRef {

    private chatControlRef?: LuxChatControlRef;
    public data: LuxChatDataEntry[] = [];

    constructor(public title: string, public created_at: Date){}

    get userName(): string {
        return this.chatControlRef?.userName || "";
    }

    public initControl(chatControlRef: LuxChatControlRef){
        this.chatControlRef = chatControlRef;

        // for(let entry of this.data){
        //     entry.chatControlRef = chatControlRef;
        // }
    }

    addChatEntry(userName: string, content: string, time: Date, smoothScrolling = true): LuxChatDataEntry {
        //pass this instead of chatControlRef ?
        const chatEntry = new LuxChatDataEntry(this, userName, content, time);
        this.data.push(chatEntry);

        // this.scrolltoBottom(smoothScrolling);

        return chatEntry;
    }

}