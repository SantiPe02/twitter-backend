import { ConflictException, NotFoundException, ValidationException, db, validateUuid } from '@utils'
import { FollowDTO, FollowInputDTO } from '../dto'
import { FollowerRepository } from '../repository'
import { FollowerService } from './follower.service'
import { UserServiceImpl } from '@domains/user/service'
import { UserRepositoryImpl } from '@domains/user/repository'

export class FollowerServiceImpl implements FollowerService {
  constructor (private readonly followerRepository: FollowerRepository) {}

  private readonly userService = new UserServiceImpl(new UserRepositoryImpl(db))

  async follow (followerId: string, followedId: string): Promise<FollowDTO> {
    validateUuid(followedId)
    if (followerId === followedId) throw new ValidationException([{ error: 'Cannot follow yourself' }])
    const followed = await this.userService.getUser(followedId)
    if (followed === null) throw new NotFoundException('User')
    const alreadyFollows = await this.followerRepository.getFollow(followerId, followedId)
    if (alreadyFollows) throw new ConflictException('Already follows')
    const follow = new FollowInputDTO({ followerId, followedId })
    return await this.followerRepository.follow(follow)
  }

  async unfollow (followerId: string, followedId: string): Promise<void> {
    validateUuid(followedId)
    const follow = await this.followerRepository.getFollow(followerId, followedId)
    if (!follow) throw new ValidationException([{ error: 'Not following' }])
    await this.followerRepository.unfollow(follow.id)
  }
}
