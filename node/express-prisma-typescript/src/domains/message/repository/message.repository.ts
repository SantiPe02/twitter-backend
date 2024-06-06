import { MessageDTO, SendMessageDTO } from '../dto'

export interface MessageRepository {
  sendMessage: (data: SendMessageDTO) => Promise<MessageDTO>
  getMessages: (chatId: string) => Promise<MessageDTO[]>
  deleteMessage: (messageId: string) => Promise<void>
  updateMessage: (messageId: string, content: string) => Promise<MessageDTO>
  getMessageById: (messageId: string) => Promise<MessageDTO | null>
}
