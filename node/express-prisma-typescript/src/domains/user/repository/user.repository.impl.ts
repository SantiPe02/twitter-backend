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
    return user ? new UserViewDTO(user) : null
  }

  async delete (userId: any): Promise<void> {
    await this.db.user.delete({
      where: {
        id: userId
      }
    })
  }

  async getRecommendedUsersPaginated (options: OffsetPagination): Promise<UserViewDTO[]> {
    const users = await this.db.user.findMany({
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      orderBy: [
        {
          id: 'asc'
        }
      ]
    })
    return users.map(user => new UserViewDTO(user))
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

  async getFollowers (userId: any): Promise<UserViewDTO[]> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      },
      include: {
        followers: {
          include: {
            follower: true
          }
        }
      }
    })
    return user?.followers.map((follower) => new UserViewDTO(follower.follower)) ?? []
  }

  async getFollows (userId: any): Promise<UserViewDTO[]> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      },
      include: {
        follows: {
          include: {
            followed: true
          }
        }
      }
    })
    return user?.follows.map((follow) => new UserViewDTO(follow.followed)) ?? []
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

  async getUsersFilteredByUsername (username: string, options: OffsetPagination): Promise<UserViewDTO[]> {
    const users = await this.db.user.findMany({
      where: {
        username: {
          contains: username
        }
      },
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      orderBy: [
        {
          id: 'asc'
        }
      ]
    })
    return users.map(user => new UserViewDTO(user))
  }
}
