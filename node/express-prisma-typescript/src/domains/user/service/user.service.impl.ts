import { NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { UserProfileDTO, UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'
import { AccountType } from '@prisma/client'
import { db, getPresignedUrl, validateUuid } from '@utils'
import { generateRandomUuid } from '@utils/functions'
import { PostServiceImpl } from '@domains/post/service'
import { PostRepositoryImpl } from '@domains/post/repository'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository) {}

  private readonly postService = new PostServiceImpl(new PostRepositoryImpl(db))

  async getUser (userId: any, myId?: any): Promise<UserViewDTO | null> {
    validateUuid(userId)
    const user = await this.repository.getById(userId)
    if (!user) throw new NotFoundException('user')
    return user
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserViewDTO[]> {
    const myFollows = await this.getFollows(userId)
    const followsFollows = await Promise.all(myFollows.map(async follow => await this.getFollows(follow.id)))
    const users = (await this.repository.getRecommendedUsersPaginated(options)).filter(user => user.id !== userId).filter(user => !myFollows.some(follow => follow.id === user.id))

    const recommendedUsers = users.filter(user => followsFollows.some(follows => follows.some(follow => follow.id === user.id)))
    return recommendedUsers
  }

  async deleteUser (userId: any): Promise<void> {
    await this.repository.delete(userId)
  }

  async switchAccountType (userId: any): Promise<void> {
    const user = await this.getUser(userId)
    if (!user) throw new NotFoundException('user')
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
    const user = await this.getUser(userId)
    const pictureId = generateRandomUuid()
    if (!user) throw new NotFoundException('user')
    const url = await getPresignedUrl(`profile/${userId as string}/${pictureId}`)
    await this.repository.uploadProfilePicture(userId, pictureId)
    return url
  }

  async getUsersFilteredByUsername (username: string, options: OffsetPagination): Promise<UserViewDTO[]> {
    return await this.repository.getUsersFilteredByUsername(username, options)
  }

  async getAccountType (userId: any): Promise<AccountType> {
    return await this.repository.getAccountType(userId)
  }

  async getUserProfile (myId: string, userId: string): Promise<UserProfileDTO> {
    const user = await this.repository.getById(userId)
    if (!user) throw new NotFoundException('user')
    const createdAt = user.createdAt
    const followers = await this.repository.getFollowers(userId)
    const following = await this.repository.getFollows(userId)
    const posts = await this.postService.getPostsByAuthor(myId, userId)
    const privateAccount = await this.repository.getAccountType(userId) === AccountType.PRIVATE
    return new UserProfileDTO({ ...user, followers, following, posts, private: privateAccount, createdAt })
  }
}
