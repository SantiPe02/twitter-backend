import { ForbiddenException, NotFoundException, db, validateUuid } from '@utils'
import { ChatDTO, ExtendedChatDTO } from '../dto'
import { ChatRepository } from '../repository/chat.repository'
import { ChatService } from './chat.service'
import { ChatUserServiceImpl } from '@domains/chatuser/service/chatuser.service.impl'
import { ChatUserRepositoryImpl } from '@domains/chatuser/repository/chatuser.repository.impl'
import { MessageServiceImpl } from '@domains/message/service/message.service.impl'
import { MessageRepositoryImpl } from '@domains/message/repository/message.repository.impl'
import { MessageDTO } from '@domains/message/dto'
import { UserServiceImpl } from '@domains/user/service'
import { UserRepositoryImpl } from '@domains/user/repository'

export class ChatServiceImpl implements ChatService {
  constructor (private readonly chatRepository: ChatRepository) {}

  private readonly relationService = new ChatUserServiceImpl(new ChatUserRepositoryImpl(db))
  private readonly messageService = new MessageServiceImpl(new MessageRepositoryImpl(db))
  private readonly chatUserService = new ChatUserServiceImpl(new ChatUserRepositoryImpl(db))
  private readonly userService = new UserServiceImpl(new UserRepositoryImpl(db))

  async createChat (name: string): Promise<ChatDTO> {
    return await this.chatRepository.createChat(name)
  }

  async deleteChat (chatId: string, userId: string): Promise<void> {
    validateUuid(chatId)
    validateUuid(userId)
    await this.validateChat(chatId)

    await this.validateRelation(userId, chatId)

    await this.chatRepository.deleteChat(chatId)
  }

  async getChatById (chatId: string, userId: string): Promise<ExtendedChatDTO> {
    validateUuid(chatId)
    const chat = await this.chatRepository.getChatById(chatId)
    if (!chat) throw new NotFoundException('Chat')

    await this.validateRelation(userId, chatId)

    return chat
  }

  async sendMessageToChat (chatId: string, senderId: string, content: string): Promise<MessageDTO> {
    validateUuid(chatId)
    validateUuid(senderId)
    await this.validateChat(chatId)

    await this.validateRelation(senderId, chatId)

    return await this.messageService.sendMessage(chatId, senderId, content)
  }

  async joinChat (userId: string, chatId: string, currentUserId?: string): Promise<void> {
    validateUuid(chatId)
    validateUuid(userId)
    await this.validateChat(chatId)

    if (currentUserId) {
      await this.validateRelation(currentUserId, chatId)
      await this.validateUserFollows(userId, currentUserId)
    }
    if (currentUserId === userId) throw new ForbiddenException()

    await this.chatUserService.joinChat(userId, chatId)
  }

  async leaveChat (userId: string, chatId: string, currentUserId?: string): Promise<void> {
    validateUuid(chatId)
    validateUuid(userId)
    await this.validateChat(chatId)

    if (currentUserId) await this.validateRelation(currentUserId, chatId)
    if (currentUserId === userId) throw new ForbiddenException()

    await this.validateRelation(userId, chatId)

    await this.chatUserService.leaveChat(userId, chatId)
  }

  async getChatsByUserId (userId: string): Promise<ExtendedChatDTO[]> {
    validateUuid(userId)
    return await this.chatRepository.getChatsByUserId(userId)
  }

  // Function to validate that user belongs to chat
  private async validateRelation (userId: string, chatId: string): Promise<void> {
    const relation = await this.relationService.getRelation(userId, chatId)
    if (!relation) throw new ForbiddenException()
  }

  // Function to validate that chat exists
  private async validateChat (chatId: string): Promise<void> {
    const chat = await this.chatRepository.getChatById(chatId)
    if (!chat) throw new NotFoundException('chat')
  }

  // Function to validate that users follow each other
  private async validateUserFollows (userId: string, currentUserId: string): Promise<void> {
    const myFollowers = await this.userService.getFollowers(currentUserId)
    const userFollowers = await this.userService.getFollowers(userId)
    console.log(myFollowers, userFollowers)

    if (
      !myFollowers.find((follower) => follower.id === userId) ||
      !userFollowers.find((follower) => follower.id === currentUserId)
    ) {
      throw new ForbiddenException()
    }
  }
}
