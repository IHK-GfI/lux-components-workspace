import { LuxChatAiMessageDto } from "./lux-chat-ai-message.dto";

export interface LuxChatDto {
  chat_id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
  messages: LuxChatAiMessageDto[];
}