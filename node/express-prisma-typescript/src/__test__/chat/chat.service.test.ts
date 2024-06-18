import { prismaMock } from '../../testconfig/singleton'
import { ChatServiceImpl } from '../../domains/chat/service/chat.service.impl'
import { ChatRepositoryImpl } from '../../domains/chat/repository/chat.repository.impl'
import { Chat } from '@prisma/client'
import { ForbiddenException, NotFoundException, ValidationException } from '@utils'
import { ExtendedChatDTO } from '@domains/chat/dto'
import { ChatUserServiceImpl } from '@domains/chatuser/service/chatuser.service.impl'
import { ChatUserDTO } from '@domains/chatuser/dto'
import { UserServiceImpl } from '@domains/user/service'
import { UserViewDTO } from '@domains/user/dto'

const chatService = new ChatServiceImpl(new ChatRepositoryImpl(prismaMock))

const useruuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d478'
const anotherUseruuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d475'
const chatuuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'

const chatMock: Chat = {
  id: chatuuid,
  name: 'test chat'
}

const extendedChatMock: ExtendedChatDTO = {
  id: chatuuid,
  name: 'test chat',
  messages: [],
  users: []
}

const chatUserMock: ChatUserDTO = {
  userId: useruuid,
  chatId: chatuuid
}

const myUserViewMock: UserViewDTO = {
  id: useruuid,
  username: 'testuser',
  name: 'Test User',
  profilePicture: null
}

const anotherUserViewMock: UserViewDTO = {
  id: anotherUseruuid,
  username: 'testuser2',
  name: 'Test User 2',
  profilePicture: null
}

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(ChatRepositoryImpl.prototype, 'getChatById').mockResolvedValue(extendedChatMock)
  jest.spyOn(ChatRepositoryImpl.prototype, 'getChatsByUserId').mockResolvedValue([extendedChatMock])
})

describe('Chat Service', () => {
  describe('create', () => {
    it('should return a chat', async () => {
      prismaMock.chat.create.mockResolvedValue(chatMock)

      const chat = await chatService.createChat(chatMock.name)

      expect(chat).toBeDefined()
    })
    it('should throw an error if chat name is missing', async () => {
      prismaMock.chat.create.mockRejectedValue(new Error('Validation Error'))

      await expect(chatService.createChat('')).rejects.toThrow(new Error('Validation Error'))
    })
  })
  describe('delete', () => {
    it('should delete a chat', async () => {
      prismaMock.chat.findUnique.mockResolvedValue(chatMock)
      jest.spyOn(ChatUserServiceImpl.prototype, 'getRelation').mockResolvedValue(chatUserMock)

      await chatService.deleteChat(useruuid, chatuuid)

      expect(prismaMock.chat.delete).toHaveBeenCalled()
    })
    it('should throw an error if chat does not exist', async () => {
      jest.spyOn(ChatRepositoryImpl.prototype, 'getChatById').mockResolvedValue(null)

      await expect(chatService.deleteChat(chatuuid, useruuid)).rejects.toThrow(new NotFoundException('chat'))
    })
    it('should throw an error if user is not in chat', async () => {
      jest.spyOn(ChatUserServiceImpl.prototype, 'getRelation').mockResolvedValue(null)

      await expect(chatService.deleteChat(chatuuid, useruuid)).rejects.toThrow(new ForbiddenException())
    })
  })
  describe('get', () => {
    it('should return a chat', async () => {
      jest.spyOn(ChatUserServiceImpl.prototype, 'getRelation').mockResolvedValue(chatUserMock)

      const chat = await chatService.getChatById(chatuuid, useruuid)

      expect(chat).toBeDefined()
    })
    it('should throw an error if chat does not exist', async () => {
      jest.spyOn(ChatRepositoryImpl.prototype, 'getChatById').mockResolvedValue(null)

      await expect(chatService.getChatById(chatuuid, useruuid)).rejects.toThrow(new NotFoundException('Chat'))
    })
    it('should throw an error if user is not in chat', async () => {
      jest.spyOn(ChatUserServiceImpl.prototype, 'getRelation').mockResolvedValue(null)

      await expect(chatService.getChatById(chatuuid, useruuid)).rejects.toThrow(new ForbiddenException())
    })
    it('should return user chats', async () => {
      prismaMock.chat.findMany.mockResolvedValue([chatMock])

      const chats = await chatService.getChatsByUserId(useruuid)

      expect(chats).toBeDefined()
    })
  })
  describe('join', () => {
    it('should join a chat', async () => {
      const anotherChatUserMock: ChatUserDTO = {
        userId: anotherUseruuid,
        chatId: chatuuid
      }
      jest.spyOn(ChatUserServiceImpl.prototype, 'getRelation').mockResolvedValueOnce(anotherChatUserMock)
      jest.spyOn(ChatUserServiceImpl.prototype, 'getRelation').mockResolvedValueOnce(null)
      jest.spyOn(ChatUserServiceImpl.prototype, 'joinChat').mockResolvedValue(chatUserMock)
      jest.spyOn(ChatRepositoryImpl.prototype, 'getChatById').mockResolvedValue(extendedChatMock)
      jest.spyOn(UserServiceImpl.prototype, 'getFollowers').mockResolvedValue([myUserViewMock, anotherUserViewMock])
      await chatService.joinChat(useruuid, chatuuid, anotherUseruuid)

      expect(ChatUserServiceImpl.prototype.joinChat).toHaveBeenCalled()
    })
    it('should throw an error if user is already in chat', async () => {
      const anotherChatUserMock: ChatUserDTO = {
        userId: anotherUseruuid,
        chatId: chatuuid
      }
      jest.spyOn(ChatUserServiceImpl.prototype, 'getRelation').mockResolvedValue(anotherChatUserMock)

      await expect(chatService.joinChat(useruuid, chatuuid)).rejects.toThrow(
        new ValidationException([{ message: 'User already in chat' }])
      )
    })
    it('should throw an error if user tries to join their own chat', async () => {
      const anotherChatUserMock: ChatUserDTO = {
        userId: anotherUseruuid,
        chatId: chatuuid
      }
      jest.spyOn(ChatUserServiceImpl.prototype, 'getRelation').mockResolvedValueOnce(anotherChatUserMock)
      jest.spyOn(ChatUserServiceImpl.prototype, 'getRelation').mockResolvedValueOnce(null)
      jest.spyOn(ChatUserServiceImpl.prototype, 'joinChat').mockResolvedValue(chatUserMock)
      jest.spyOn(ChatRepositoryImpl.prototype, 'getChatById').mockResolvedValue(extendedChatMock)
      jest.spyOn(UserServiceImpl.prototype, 'getFollowers').mockResolvedValue([myUserViewMock, anotherUserViewMock])

      await expect(chatService.joinChat(useruuid, chatuuid, useruuid)).rejects.toThrow(new ForbiddenException())
    })
    it('should throw an error if user does not follow another user', async () => {
      jest.spyOn(UserServiceImpl.prototype, 'getFollowers').mockResolvedValue([myUserViewMock])

      await expect(chatService.joinChat(useruuid, chatuuid, anotherUseruuid)).rejects.toThrow(new ForbiddenException())
    })
    it('should throw an error if chat does not exist', async () => {
      jest.spyOn(ChatRepositoryImpl.prototype, 'getChatById').mockResolvedValue(null)

      await expect(chatService.joinChat(useruuid, chatuuid)).rejects.toThrow(new NotFoundException('chat'))
    })
  })

  describe('leave', () => {
    it('should leave a chat', async () => {
      jest.spyOn(ChatUserServiceImpl.prototype, 'getRelation').mockResolvedValue(chatUserMock)

      await chatService.leaveChat(useruuid, chatuuid)

      expect(prismaMock.chatUser.delete).toHaveBeenCalled()
    })
    it('should throw an error if user is not in chat', async () => {
      jest.spyOn(ChatUserServiceImpl.prototype, 'getRelation').mockResolvedValue(null)

      await expect(chatService.leaveChat(useruuid, chatuuid)).rejects.toThrow(new ForbiddenException())
    })
    it('should throw an error if user tries to leave their own chat', async () => {
      jest.spyOn(ChatUserServiceImpl.prototype, 'getRelation').mockResolvedValue(chatUserMock)

      await expect(chatService.leaveChat(useruuid, chatuuid, useruuid)).rejects.toThrow(new ForbiddenException())
    })
    it('should throw an error if chat does not exist', async () => {
      jest.spyOn(ChatRepositoryImpl.prototype, 'getChatById').mockResolvedValue(null)

      await expect(chatService.leaveChat(useruuid, chatuuid)).rejects.toThrow(new NotFoundException('chat'))
    })
  })
})
