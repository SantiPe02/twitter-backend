import { MessageDTO } from '../dto'

export interface MessageService {
  sendMessage: (chatId: string, senderId: string, content: string) => Promise<MessageDTO>
  getMessages: (chatId: string) => Promise<MessageDTO[]>
  deleteMessage: (messageId: string, senderId: string) => Promise<void>
  updateMessage: (messageId: string, content: string) => Promise<MessageDTO>
  getMessageById: (messageId: string) => Promise<MessageDTO | null>
}
