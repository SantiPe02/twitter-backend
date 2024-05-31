import { OffsetPagination } from '@types'
import { UserViewDTO } from '../dto'

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserViewDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserViewDTO[]>
  switchAccountType: (userId: any) => Promise<void>
  getFollowers: (userId: any) => Promise<string[]>
  getFollows: (userId: any) => Promise<string[]>
  uploadProfilePicture: (userId: any) => Promise<string>
}
