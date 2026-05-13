export class LuxChatMessageData {
    
    public metadata: any = {};

    constructor(public user: string, public content: string, public time: Date){}
}