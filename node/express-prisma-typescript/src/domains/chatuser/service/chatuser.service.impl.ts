import { validateUuid } from '@utils'
import { ChatUserDTO } from '../dto'
import { ChatUserRepository } from '../repository/chatuser.repository'
import { ChatUserService } from './chatuser.service'

export class ChatUserServiceImpl implements ChatUserService {
  constructor (private readonly chatUserRepository: ChatUserRepository) {}

  async joinChat (userId: string, chatId: string): Promise<ChatUserDTO> {
    validateUuid(userId)
    validateUuid(chatId)
    const relation = await this.chatUserRepository.joinChat(userId, chatId)
    return relation
  }

  async leaveChat (userId: string, chatId: string): Promise<void> {
    validateUuid(userId)
    validateUuid(chatId)
    await this.chatUserRepository.leaveChat(userId, chatId)
  }

  async getRelation (userId: string, chatId: string): Promise<ChatUserDTO | null> {
    validateUuid(userId)
    validateUuid(chatId)
    const relation = await this.chatUserRepository.getRelation(userId, chatId)
    return relation
  }
}
