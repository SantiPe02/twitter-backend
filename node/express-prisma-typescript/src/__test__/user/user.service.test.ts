import { prismaMock } from '../../testconfig/singleton'
import { UserServiceImpl } from '../../domains/user/service/user.service.impl'
import { UserRepositoryImpl } from '../../domains/user/repository/user.repository.impl'
import { AccountType, User } from '@prisma/client'
import { UserViewDTO } from '@domains/user/dto'
import { NotFoundException } from '@utils'

const userService = new UserServiceImpl(new UserRepositoryImpl(prismaMock))

const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
const anotherUuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d478'

const userMock: User = {
  id: uuid,
  email: 'test@gmail.com',
  username: 'test',
  password: 'passwordtest',
  name: 'Test',
  profilePicture: null,
  accountType: AccountType.PUBLIC,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}

const userPayload: UserViewDTO = {
  id: uuid,
  name: 'Test',
  username: 'test',
  profilePicture: null
}

beforeEach(() => {
  jest.clearAllMocks()

  prismaMock.user.create.mockResolvedValue(userMock)
})

describe('User Service', () => {
  describe('Get user by id', () => {
    it('should return a user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(userMock)

      const user = await userService.getUser(uuid)

      expect(user).toEqual(userPayload)
    })

    it('should throw an error if user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)

      await expect(userService.getUser(uuid)).rejects.toThrow(new NotFoundException('user'))
    })

    it('should return a user if the user is the same as the requester', async () => {
      prismaMock.user.findUnique.mockResolvedValue(userMock)

      const user = await userService.getUser(uuid, uuid)

      expect(user).toEqual(userPayload)
    })

    it('should return a user if the user is public', async () => {
      prismaMock.user.findUnique.mockResolvedValue(userMock)
      prismaMock.user.findFirst.mockResolvedValue({ ...userMock, accountType: AccountType.PUBLIC })

      const user = await userService.getUser(uuid, anotherUuid)

      expect(user).toEqual(userPayload)
    })
  })

  describe('Delete user', () => {
    it('should delete a user', async () => {
      await userService.deleteUser(uuid)

      expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id: uuid } })
    })
  })

  describe('Switch account type', () => {
    it('should switch account type', async () => {
      prismaMock.user.findUnique.mockResolvedValue(userMock)
      await userService.switchAccountType(uuid)

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: uuid },
        data: { accountType: AccountType.PRIVATE }
      })
    })
  })

  describe('Get followers', () => {
    it('should return followers', async () => {
      jest.spyOn(UserServiceImpl.prototype, 'getFollowers').mockResolvedValue([userPayload])

      const users = await userService.getFollowers(uuid)

      expect(users).toEqual([userPayload])
    })
  })

  describe('Get follows', () => {
    it('should return follows', async () => {
      jest.spyOn(UserServiceImpl.prototype, 'getFollows').mockResolvedValue([userPayload])

      const users = await userService.getFollows(uuid)

      expect(users).toEqual([userPayload])
    })
  })

  describe('Get users filtered by username', () => {
    it('should return users filtered by username', async () => {
      prismaMock.user.findMany.mockResolvedValue([userMock])

      const users = await userService.getUsersFilteredByUsername('test', { limit: 10, skip: 0 })

      expect(users).toEqual([userPayload])
    })
  })
})
