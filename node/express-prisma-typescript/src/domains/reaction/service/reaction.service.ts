import { ReactionInputDTO } from '../dto'

export interface ReactionService {
  create: (userId: string, postId: string, reactionType: string) => Promise<void>
  delete: (userId: string, postId: string, reactionType: string) => Promise<void>
  getLikesByUserId: (userId: string) => Promise<ReactionInputDTO[]>
  getRetweetsByUserId: (userId: string) => Promise<ReactionInputDTO[]>
}
