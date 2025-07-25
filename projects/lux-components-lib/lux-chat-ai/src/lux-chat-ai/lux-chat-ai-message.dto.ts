import { LuxChatAiMessageContextDto } from "./lux-chat-ai-message-context.dto";
import { LuxChatAiMessageInternalDto } from "./lux-chat-ai-message-internal.dto";

export interface LuxChatAiMessageDto {
  chat_id: string;
  message_id: string;
  content: string;
  sender_role: string;
  created_at: Date;
  contexts: LuxChatAiMessageContextDto[];
  internal_messages: LuxChatAiMessageInternalDto[];
}