import { PrismaClient, ReactionType } from '@prisma/client'
import { ReactionRepository } from './reaction.repository'
import { ReactionDTO, ReactionInputDTO } from '../dto'

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (reactionInput: ReactionInputDTO): Promise<void> {
    await this.db.reaction.create({
      data: {
        userId: reactionInput.userId,
        postId: reactionInput.postId,
        reactionType: reactionInput.reactionType
      }
    })
  }

  async delete (reactionInput: ReactionInputDTO): Promise<void> {
    await this.db.reaction.deleteMany({
      where: {
        userId: reactionInput.userId,
        postId: reactionInput.postId,
        reactionType: reactionInput.reactionType
      }
    })
  }

  async getReaction (reactionInput: ReactionInputDTO): Promise<ReactionDTO | null> {
    const reaction = await this.db.reaction.findFirst({
      where: {
        userId: reactionInput.userId,
        postId: reactionInput.postId,
        reactionType: reactionInput.reactionType
      }
    })
    return reaction != null ? new ReactionDTO(reaction) : null
  }

  async getPostAuthorAccountType (postId: string): Promise<string | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      },
      include: {
        author: {
          select: {
            accountType: true
          }
        }
      }
    })
    return post?.author.accountType as string ?? null
  }

  async getAuthorFollowers (postId: string): Promise<string[]> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      },
      include: {
        author: {
          include: {
            followers: true
          }
        }
      }
    })
    return post?.author.followers.map(follower => follower.followerId) ?? []
  }

  async getLikesByUserId (userId: string): Promise<ReactionDTO[]> {
    return await this.db.reaction.findMany({
      where: {
        userId,
        reactionType: ReactionType.LIKE
      }
    }).then(reactions => reactions.map(reaction => new ReactionDTO(reaction)))
  }

  async getRetweetsByUserId (userId: string): Promise<ReactionDTO[]> {
    return await this.db.reaction.findMany({
      where: {
        userId,
        reactionType: ReactionType.RETWEET
      }
    }).then(reactions => reactions.map(reaction => new ReactionDTO(reaction)))
  }
}
