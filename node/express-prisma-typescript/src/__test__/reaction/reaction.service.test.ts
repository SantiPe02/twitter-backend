import { prismaMock } from '../../testconfig/singleton'
import { ReactionServiceImpl } from '../../domains/reaction/service/reaction.service.impl'
import { ReactionRepositoryImpl } from '../../domains/reaction/repository/reaction.repository.impl'
import { ReactionDTO } from '@domains/reaction/dto'
import { ConflictException, NotFoundException } from '@utils'

const reactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(prismaMock))

const useruuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d478'
const postuuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d477'
const reactionuuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'

const reactionMock: ReactionDTO = {
  id: reactionuuid,
  userId: useruuid,
  postId: postuuid,
  reactionType: 'LIKE'
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Reaction Service', () => {
  describe('create', () => {
    it('should create a reaction', async () => {
      jest.spyOn(ReactionRepositoryImpl.prototype, 'getReaction').mockResolvedValue(null)
      jest.spyOn(ReactionRepositoryImpl.prototype, 'getPostAuthorAccountType').mockResolvedValue('PUBLIC')

      await reactionService.create(useruuid, postuuid, 'LIKE')

      expect(prismaMock.reaction.create).toHaveBeenCalledTimes(1)
    })
    it('should throw conflict if already reacted', async () => {
      jest.spyOn(ReactionRepositoryImpl.prototype, 'getReaction').mockResolvedValue(reactionMock)

      await expect(reactionService.create(useruuid, postuuid, 'LIKE')).rejects.toThrow(
        new ConflictException('Already reacted')
      )
    })
    it('should throw not found if post does not exist', async () => {
      jest.spyOn(ReactionRepositoryImpl.prototype, 'getPostAuthorAccountType').mockResolvedValue(null)

      await expect(reactionService.create(useruuid, postuuid, 'LIKE')).rejects.toThrow(new NotFoundException('post'))
    })
    it('should throw not found if post is private and user is not a follower', async () => {
      jest.spyOn(ReactionRepositoryImpl.prototype, 'getPostAuthorAccountType').mockResolvedValue('PRIVATE')
      jest.spyOn(ReactionRepositoryImpl.prototype, 'getAuthorFollowers').mockResolvedValue([])

      await expect(reactionService.create(useruuid, postuuid, 'LIKE')).rejects.toThrow(new NotFoundException())
    })
  })
  describe('delete', () => {
    it('should delete a reaction', async () => {
      jest.spyOn(ReactionRepositoryImpl.prototype, 'getReaction').mockResolvedValue(reactionMock)
      jest.spyOn(ReactionRepositoryImpl.prototype, 'getPostAuthorAccountType').mockResolvedValue('PUBLIC')

      await expect(reactionService.delete(useruuid, postuuid, 'LIKE')).resolves.not.toThrow()
    })
    it('should throw not found if post does not exist', async () => {
      jest.spyOn(ReactionRepositoryImpl.prototype, 'getPostAuthorAccountType').mockResolvedValue(null)

      await expect(reactionService.delete(useruuid, postuuid, 'LIKE')).rejects.toThrow(new NotFoundException('post'))
    })
    it('should throw not found if reaction does not exist', async () => {
      jest.spyOn(ReactionRepositoryImpl.prototype, 'getReaction').mockResolvedValue(null)
      jest.spyOn(ReactionRepositoryImpl.prototype, 'getPostAuthorAccountType').mockResolvedValue('PUBLIC')

      await expect(reactionService.delete(useruuid, postuuid, 'LIKE')).rejects.toThrow(new NotFoundException('reaction'))
    })
  })
})
