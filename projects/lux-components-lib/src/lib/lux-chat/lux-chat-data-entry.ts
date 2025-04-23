import { LuxChatControlRef } from "./lux-chat-control-ref";

export class LuxChatDataEntry {

    constructor(public chatControlRef: LuxChatControlRef, public user: string, public content: string, public time: Date){}

    get userName() {
        return this.user;
    }

    get isUser(): boolean {
        // console.log("CHECK", this.chatControlRef, this.chatControlRef.userName, this.user);
        return this.chatControlRef.userName === this.user;
    }

}