import { LuxChatAiMessageContextDto } from "./lux-chat-ai-message-context.dto";

export interface LuxChatAiMessageDto {
  chat_id: string;
  message_id: string;
  content: string;
  sender_name: string;
  created_at: Date;
  contexts: LuxChatAiMessageContextDto[];
}