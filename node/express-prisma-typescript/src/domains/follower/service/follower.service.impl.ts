import { ConflictException, ValidationException } from '@utils'
import { FollowDTO, FollowInputDTO } from '../dto'
import { FollowerRepository } from '../repository'
import { FollowerService } from './follower.service'

export class FollowerServiceImpl implements FollowerService {
  constructor (private readonly followerRepository: FollowerRepository) {}

  async follow (followerId: string, followedId: string): Promise<FollowDTO> {
    if (followerId === followedId) throw new ValidationException([{ error: 'Cannot follow yourself' }])
    const alreadyFollows = await this.followerRepository.getFollow(followerId, followedId)
    if (alreadyFollows) throw new ConflictException('Already follows')
    const follow = new FollowInputDTO({ followerId, followedId })
    return await this.followerRepository.follow(follow)
  }

  async unfollow (followerId: string, followedId: string): Promise<void> {
    const follow = await this.followerRepository.getFollow(followerId, followedId)
    if (!follow) throw new ValidationException([{ error: 'Not following' }])
    await this.followerRepository.unfollow(follow.id)
  }
}
