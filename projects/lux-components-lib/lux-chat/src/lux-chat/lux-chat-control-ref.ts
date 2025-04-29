import { LuxChatData } from "./lux-chat-data";

export interface LuxChatControlRef {
    get chat(): LuxChatData | undefined;
    get userName(): string;
    scrollToBottom(smoothScrolling?: boolean): void;
    scrollToBottomForced(smoothScrolling?: boolean): void;
    
}