import { MessageDTO } from '@domains/message/dto'
import { ChatDTO, ExtendedChatDTO } from '../dto'

export interface ChatService {
  createChat: (name: string) => Promise<ChatDTO>
  deleteChat: (chatId: string, userId: string) => Promise<void>
  getChatById: (chatId: string, userId: string) => Promise<ExtendedChatDTO>
  sendMessageToChat: (chatId: string, senderId: string, content: string) => Promise<MessageDTO>
  joinChat: (userId: string, chatId: string, currentUserId?: string) => Promise<void>
  leaveChat: (userId: string, chatId: string, currentUserId?: string) => Promise<void>
}
