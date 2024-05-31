import { NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'
import { AccountType } from '@prisma/client'
import { getPresignedUrl } from '@utils'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository) {}

  async getUser (userId: any): Promise<UserViewDTO> {
    const user = await this.repository.getById(userId)
    if (!user) throw new NotFoundException('user')
    return user
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserDTO[]> {
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

  async getFollowers (userId: any): Promise<string[]> {
    return await this.repository.getFollowers(userId)
  }

  async getFollows (userId: any): Promise<string[]> {
    return await this.repository.getFollows(userId)
  }

  async uploadProfilePicture (userId: any): Promise<string> {
    const url = await getPresignedUrl(`profile-picture-user-${userId as string}`)
    await this.repository.uploadProfilePicture(userId, url)
    return url
  }
}
