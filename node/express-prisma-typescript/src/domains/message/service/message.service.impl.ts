import { ForbiddenException, NotFoundException, validateUuid } from '@utils'
import { MessageDTO, SendMessageDTO } from '../dto'
import { MessageRepository } from '../repository/message.repository'
import { MessageService } from './message.service'

export class MessageServiceImpl implements MessageService {
  constructor (private readonly messageRepository: MessageRepository) {}

  async sendMessage (chatId: string, senderId: string, content: string): Promise<MessageDTO> {
    validateUuid(chatId)
    validateUuid(senderId)

    return await this.messageRepository.sendMessage(new SendMessageDTO({ chatId, senderId, content }))
  }

  async getMessages (chatId: string): Promise<MessageDTO[]> {
    return await this.messageRepository.getMessages(chatId)
  }

  async deleteMessage (messageId: string, senderId: string): Promise<void> {
    validateUuid(senderId)
    validateUuid(messageId)
    const message = await this.messageRepository.getMessageById(messageId)
    if (!message) {
      throw new NotFoundException('message')
    }
    if (message.senderId !== senderId) {
      throw new ForbiddenException()
    }
    await this.messageRepository.deleteMessage(messageId)
  }

  async updateMessage (messageId: string, content: string): Promise<MessageDTO> {
    return await this.messageRepository.updateMessage(messageId, content)
  }

  async getMessageById (messageId: string): Promise<MessageDTO | null> {
    return await this.messageRepository.getMessageById(messageId)
  }
}
