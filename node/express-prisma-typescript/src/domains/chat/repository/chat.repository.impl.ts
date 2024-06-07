import { PrismaClient } from '@prisma/client'
import { ChatDTO, ExtendedChatDTO } from '../dto'
import { ChatRepository } from './chat.repository'
import { MessageDTO } from '@domains/message/dto'
import { UserViewDTO } from '@domains/user/dto'

export class ChatRepositoryImpl implements ChatRepository {
  constructor (private readonly db: PrismaClient) {}

  async createChat (name: string): Promise<ChatDTO> {
    const chat = await this.db.chat.create({
      data: {
        name
      }
    })
    return new ChatDTO(chat)
  }

  async deleteChat (chatId: string): Promise<void> {
    await this.db.chat.delete({
      where: {
        id: chatId
      }
    })
  }

  async getChatById (chatId: string): Promise<ExtendedChatDTO | null> {
    const chat = await this.db.chat.findUnique({
      where: {
        id: chatId
      },
      include: {
        messages: true,
        users: {
          include: {
            user: true
          }
        }
      }
    })
    if (!chat) return null
    const messages = chat.messages.map(message => new MessageDTO(message))
    const users = chat.users.map(user => new UserViewDTO(user.user))
    return new ExtendedChatDTO({ id: chatId, name: chat.name, messages, users })
  }

  async getChatsByUserId (userId: string): Promise<ExtendedChatDTO[]> {
    const chats = await this.db.chat.findMany({
      where: {
        users: {
          some: {
            userId
          }
        }
      },
      include: {
        messages: true,
        users: {
          include: {
            user: true
          }
        }
      }
    })
    return chats.map(chat => new ExtendedChatDTO({ id: chat.id, name: chat.name, messages: chat.messages.map(message => new MessageDTO(message)), users: chat.users.map(user => new UserViewDTO(user.user)) }))
  }
}
