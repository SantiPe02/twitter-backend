import { FollowDTO, FollowInputDTO } from '../dto'

export interface FollowerRepository {
  follow: (followInput: FollowInputDTO) => Promise<FollowDTO>
  unfollow: (followId: string) => Promise<void>
  getFollow: (followerId: string, followedId: string) => Promise<FollowDTO | null>
}
