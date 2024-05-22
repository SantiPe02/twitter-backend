import { FollowInputDTO, FollowDTO } from '../dto'
import { FollowerRepository } from './follower.repository'
import { PrismaClient } from '@prisma/client'

export class FollowerRepositoryImpl implements FollowerRepository {
  constructor (private readonly db: PrismaClient) {}

  async follow (followInput: FollowInputDTO): Promise<FollowDTO> {
    return await this.db.follow
      .create({
        data: {
          followerId: followInput.followerId,
          followedId: followInput.followedId
        }
      })
      .then((follow) => new FollowDTO(follow))
  }

  async unfollow (followId: any): Promise<void> {
    await this.db.follow.delete({
      where: {
        id: followId
      }
    })
  }

  async getFollow (followerId: string, followedId: string): Promise<FollowDTO | null> {
    const follow = await this.db.follow.findFirst({
      where: {
        followerId,
        followedId
      }
    })
    return follow ? new FollowDTO(follow) : null
  }
}
