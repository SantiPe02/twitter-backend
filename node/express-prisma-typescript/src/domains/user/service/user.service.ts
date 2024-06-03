import { OffsetPagination } from '@types'
import { UserViewDTO } from '../dto'

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any, myId?: any) => Promise<UserViewDTO | null>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserViewDTO[]>
  switchAccountType: (userId: any) => Promise<void>
  getFollowers: (userId: any) => Promise<UserViewDTO[]>
  getFollows: (userId: any) => Promise<UserViewDTO[]>
  uploadProfilePicture: (userId: any) => Promise<string>
  getUsersFilteredByUsername: (username: string, options: OffsetPagination) => Promise<UserViewDTO[]>
}
