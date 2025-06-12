import { LuxChatControlRef } from "./lux-chat-control-ref";

export class LuxChatDataEntry {

    public metadata: any = {};

    constructor(public chatControlRef: LuxChatControlRef, public user: string, public content: string, public time: Date){}

    get userName() {
        return this.user;
    }

    get isUser(): boolean {
        return this.chatControlRef.userName === this.user;
    }

}