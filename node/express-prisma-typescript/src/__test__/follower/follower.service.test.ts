import { prismaMock } from '../../testconfig/singleton'
import { FollowerServiceImpl } from '../../domains/follower/service/follower.service.impl'
import { FollowerRepositoryImpl } from '../../domains/follower/repository/follower.repository.impl'
import { ConflictException, NotFoundException, ValidationException } from '@utils'
import { FollowDTO } from '@domains/follower/dto'
import { UserServiceImpl } from '@domains/user/service'

const followerService = new FollowerServiceImpl(new FollowerRepositoryImpl(prismaMock))

const followuuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
const followeruuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d477'
const followeduuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d478'

const followPayload: FollowDTO = {
  id: followuuid,
  followerId: followeruuid,
  followedId: followeduuid,
  createdAt: new Date()
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Follower Service', () => {
  describe('follow', () => {
    it('should follow a user', async () => {
      jest.spyOn(FollowerRepositoryImpl.prototype, 'follow').mockResolvedValue(followPayload)
      jest.spyOn(UserServiceImpl.prototype, 'getUser').mockResolvedValue({ id: followeduuid } as any)
      jest.spyOn(FollowerRepositoryImpl.prototype, 'getFollow').mockResolvedValue(null)

      const follow = await followerService.follow(followeruuid, followeduuid)

      expect(follow).toEqual(followPayload)
    })
    it('should throw an error if user follows itself', async () => {
      await expect(followerService.follow(followeruuid, followeruuid)).rejects.toThrow(
        new ValidationException([{ error: 'Cannot follow yourself' }])
      )
    })
    it('should throw an error if user does not exist', async () => {
      jest.spyOn(UserServiceImpl.prototype, 'getUser').mockResolvedValue(null)

      await expect(followerService.follow(followeruuid, followeduuid)).rejects.toThrow(new NotFoundException('User'))
    })
    it('should throw an error if user already follows', async () => {
      jest.spyOn(UserServiceImpl.prototype, 'getUser').mockResolvedValue({ id: followeduuid } as any)
      jest.spyOn(FollowerRepositoryImpl.prototype, 'getFollow').mockResolvedValue(followPayload)

      await expect(followerService.follow(followeruuid, followeduuid)).rejects.toThrow(new ConflictException('Already follows'))
    })
  })
  describe('unfollow', () => {
    it('should unfollow a user', async () => {
      jest.spyOn(FollowerRepositoryImpl.prototype, 'getFollow').mockResolvedValue(followPayload)
      jest.spyOn(FollowerRepositoryImpl.prototype, 'unfollow').mockResolvedValue()

      await followerService.unfollow(followeruuid, followeduuid)

      expect(FollowerRepositoryImpl.prototype.unfollow).toHaveBeenCalledWith(followuuid)
    })
    it('should throw an error if user does not follow', async () => {
      jest.spyOn(FollowerRepositoryImpl.prototype, 'getFollow').mockResolvedValue(null)

      await expect(followerService.unfollow(followeruuid, followeduuid)).rejects.toThrow(new ValidationException([{ error: 'Not following' }]))
    })
  })
})
