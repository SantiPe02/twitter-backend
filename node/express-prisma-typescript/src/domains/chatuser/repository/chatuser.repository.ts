import { ChatUserDTO } from '../dto'

export interface ChatUserRepository {
  joinChat: (userId: string, chatId: string) => Promise<ChatUserDTO>
  leaveChat: (userId: string, chatId: string) => Promise<void>
  getRelation: (userId: string, chatId: string) => Promise<ChatUserDTO | null>
}
