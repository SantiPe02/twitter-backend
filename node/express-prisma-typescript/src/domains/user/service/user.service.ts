import { OffsetPagination } from '@types'
import { UserDTO, UserViewDTO } from '../dto'

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserViewDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserDTO[]>
  switchAccountType: (userId: any) => Promise<void>
  getFollowers: (userId: any) => Promise<string[]>
  getFollows: (userId: any) => Promise<string[]>
}
