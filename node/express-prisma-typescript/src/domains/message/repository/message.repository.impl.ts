import { PrismaClient } from '@prisma/client'
import { MessageDTO, SendMessageDTO } from '../dto'
import { MessageRepository } from './message.repository'

export class MessageRepositoryImpl implements MessageRepository {
  constructor (private readonly db: PrismaClient) {}

  async sendMessage (data: SendMessageDTO): Promise<MessageDTO> {
    const message = await this.db.message.create({
      data: {
        content: data.content,
        chatId: data.chatId,
        senderId: data.senderId
      }
    })
    return new MessageDTO(message)
  }

  async getMessages (chatId: string): Promise<MessageDTO[]> {
    const messages = await this.db.message.findMany({
      where: {
        chatId
      }
    })
    return messages.map(message => new MessageDTO(message))
  }

  async deleteMessage (messageId: string): Promise<void> {
    await this.db.message.delete({
      where: {
        id: messageId
      }
    })
  }

  async updateMessage (messageId: string, content: string): Promise<MessageDTO> {
    const message = await this.db.message.update({
      where: {
        id: messageId
      },
      data: {
        content
      }
    })
    return new MessageDTO(message)
  }

  async getMessageById (messageId: string): Promise<MessageDTO | null> {
    const message = await this.db.message.findUnique({
      where: {
        id: messageId
      }
    })
    if (!message) return null
    return new MessageDTO(message)
  }
}
