import { SignupInputDTO } from '@domains/auth/dto'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'
import { AccountType } from '@prisma/client'

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserDTO>
  delete: (userId: string) => Promise<void>
  getRecommendedUsersPaginated: (options: OffsetPagination) => Promise<UserDTO[]>
  getById: (userId: string) => Promise<UserViewDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  switchAccountType: (userId: string, accountType: AccountType) => Promise<void>
  getAccountType: (userId: string) => Promise<AccountType>
  getFollowers: (userId: string) => Promise<string[]>
  getFollows: (userId: string) => Promise<string[]>
  uploadProfilePicture: (userId: string, url: any) => Promise<void>
}
