import { SignupInputDTO } from '@domains/auth/dto'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'
import { AccountType } from '@prisma/client'

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserDTO>
  delete: (userId: string) => Promise<void>
  getRecommendedUsersPaginated: (options: OffsetPagination) => Promise<UserViewDTO[]>
  getById: (userId: string) => Promise<UserViewDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  switchAccountType: (userId: string, accountType: AccountType) => Promise<void>
  getAccountType: (userId: string) => Promise<AccountType>
  getFollowers: (userId: string) => Promise<UserViewDTO[]>
  getFollows: (userId: string) => Promise<UserViewDTO[]>
  uploadProfilePicture: (userId: string, url: any) => Promise<void>
  getUsersFilteredByUsername: (username: string, options: OffsetPagination) => Promise<UserViewDTO[]>
}
