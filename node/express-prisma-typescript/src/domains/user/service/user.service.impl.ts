import { NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'
import { AccountType } from '@prisma/client'
import { getPresignedUrl, validateUuid } from '@utils'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository) {}

  async getUser (userId: any, myId?: any): Promise<UserViewDTO | null> {
    validateUuid(userId)
    const user = await this.repository.getById(userId)
    if (!user) throw new NotFoundException('user')
    if (userId === myId) return user
    if (myId === undefined) return user

    const accountType = await this.repository.getAccountType(userId)
    if (accountType === AccountType.PUBLIC) return user
    const followers = await this.repository.getFollowers(userId)
    if (followers.some(follower => follower.id === myId)) return user
    return null
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserViewDTO[]> {
    // TODO: make this return only users followed by users the original user follows
    return await this.repository.getRecommendedUsersPaginated(options)
  }

  async deleteUser (userId: any): Promise<void> {
    await this.repository.delete(userId)
  }

  async switchAccountType (userId: any): Promise<void> {
    const accountType = await this.repository.getAccountType(userId) === AccountType.PUBLIC ? AccountType.PRIVATE : AccountType.PUBLIC
    await this.repository.switchAccountType(userId, accountType)
  }

  async getFollowers (userId: any): Promise<UserViewDTO[]> {
    return await this.repository.getFollowers(userId)
  }

  async getFollows (userId: any): Promise<UserViewDTO[]> {
    return await this.repository.getFollows(userId)
  }

  async uploadProfilePicture (userId: any): Promise<string> {
    const url = await getPresignedUrl(`profile-picture-user-${userId as string}`)
    await this.repository.uploadProfilePicture(userId, url)
    return url
  }

  async getUsersFilteredByUsername (username: string, options: OffsetPagination): Promise<UserViewDTO[]> {
    return await this.repository.getUsersFilteredByUsername(username, options)
  }
}
