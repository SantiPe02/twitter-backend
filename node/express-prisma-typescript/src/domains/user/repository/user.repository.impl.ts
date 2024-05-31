import { SignupInputDTO } from '@domains/auth/dto'
import { AccountType, PrismaClient } from '@prisma/client'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from './user.repository'

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (data: SignupInputDTO): Promise<UserDTO> {
    return await this.db.user.create({
      data
    }).then(user => new UserDTO(user))
  }

  async getById (userId: any): Promise<UserViewDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })
    return user ? new UserViewDTO({ id: user.id, name: user.name, username: user.username, profilePicture: user.profilePicture }) : null
  }

  async delete (userId: any): Promise<void> {
    await this.db.user.delete({
      where: {
        id: userId
      }
    })
  }

  async getRecommendedUsersPaginated (options: OffsetPagination): Promise<UserDTO[]> {
    const users = await this.db.user.findMany({
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      orderBy: [
        {
          id: 'asc'
        }
      ]
    })
    return users.map(user => new UserDTO(user))
  }

  async getByEmailOrUsername (email?: string, username?: string): Promise<ExtendedUserDTO | null> {
    const user = await this.db.user.findFirst({
      where: {
        OR: [
          {
            email
          },
          {
            username
          }
        ]
      }
    })
    return user ? new ExtendedUserDTO(user) : null
  }

  async switchAccountType (userId: any, accountType: AccountType): Promise<void> {
    await this.db.user.update({
      where: {
        id: userId
      },
      data: {
        accountType
      }
    })
  }

  async getAccountType (userId: any): Promise<AccountType> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })
    return user?.accountType ?? AccountType.PUBLIC
  }

  async getFollowers (userId: any): Promise<string[]> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      },
      include: {
        followers: true
      }
    })
    return user?.followers.map((follower) => follower.followerId) ?? []
  }

  async getFollows (userId: any): Promise<string[]> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      },
      include: {
        follows: true
      }
    })
    return user?.follows.map((follow) => follow.followedId) ?? []
  }

  async uploadProfilePicture (userId: any, url: any): Promise<void> {
    await this.db.user.update({
      where: {
        id: userId
      },
      data: {
        profilePicture: url
      }
    })
  }
}
