import { ReactionDTO, ReactionInputDTO } from '../dto'

export interface ReactionRepository {
  create: (reactionInput: ReactionInputDTO) => Promise<void>
  delete: (reactionInput: ReactionInputDTO) => Promise<void>
  getReaction: (reactionInput: ReactionInputDTO) => Promise<ReactionDTO | null>
  getPostAuthorAccountType: (postId: string) => Promise<string | null>
  getAuthorFollowers: (postId: string) => Promise<string[]>
  getLikesByUserId: (userId: string) => Promise<ReactionDTO[]>
  getRetweetsByUserId: (userId: string) => Promise<ReactionDTO[]>
}
