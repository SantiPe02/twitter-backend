import { ChatDTO, ExtendedChatDTO } from '../dto'

export interface ChatRepository {
  createChat: (name: string) => Promise<ChatDTO>
  deleteChat: (chatId: string) => Promise<void>
  getChatById: (chatId: string) => Promise<ExtendedChatDTO | null>
  getChatsByUserId: (userId: string) => Promise<ExtendedChatDTO[]>
}
