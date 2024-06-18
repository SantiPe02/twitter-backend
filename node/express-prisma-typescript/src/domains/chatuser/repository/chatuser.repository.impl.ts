import { PrismaClient } from '@prisma/client'
import { ChatUserRepository } from './chatuser.repository'
import { ChatUserDTO } from '../dto'

export class ChatUserRepositoryImpl implements ChatUserRepository {
  constructor (private readonly db: PrismaClient) {}

  async joinChat (userId: string, chatId: string): Promise<ChatUserDTO> {
    const relation = await this.db.chatUser.create({
      data: {
        userId,
        chatId
      }
    })
    return new ChatUserDTO(relation)
  }

  async leaveChat (userId: string, chatId: string): Promise<void> {
    await this.db.chatUser.delete({
      where: {
        chatId_userId: {
          chatId,
          userId
        }
      }
    })
  }

  async getRelation (userId: string, chatId: string): Promise<ChatUserDTO | null> {
    const relation = await this.db.chatUser.findUnique({
      where: {
        chatId_userId: {
          chatId,
          userId
        }
      }
    })
    if (!relation) return null
    return new ChatUserDTO(relation)
  }
}
