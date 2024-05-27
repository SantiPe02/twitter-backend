import { ReactionType } from '@prisma/client'
import { ReactionRepository } from '../repository'
import { ReactionService } from './reaction.service'
import { ReactionInputDTO } from '../dto'
import { ConflictException, NotFoundException } from '@utils'

export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly reactionRepository: ReactionRepository) {}

  async create (userId: string, postId: string, reactionType: string): Promise<void> {
    const reactionInput = new ReactionInputDTO({ userId, postId, reactionType: reactionType as ReactionType })
    await this.validateReaction(userId, postId, reactionType)

    const reaction = await this.reactionRepository.getReaction(reactionInput)
    if (reaction) throw new ConflictException('Already reacted')

    await this.reactionRepository.create(reactionInput)
  }

  async delete (userId: string, postId: string, reactionType: string): Promise<void> {
    await this.validateReaction(userId, postId, reactionType)
    await this.reactionRepository.delete(
      new ReactionInputDTO({ userId, postId, reactionType: reactionType as ReactionType })
    )
  }

  private async validateReaction (userId: string, postId: string, reactionType: string): Promise<void> {
    const postAuthorAccountType = await this.reactionRepository.getPostAuthorAccountType(postId)

    if (postAuthorAccountType === null) throw new NotFoundException('Post')

    if (postAuthorAccountType === 'PRIVATE') {
      const followers = await this.reactionRepository.getAuthorFollowers(postId)
      if (!followers.includes(userId)) throw new NotFoundException()
    }
  }
}
