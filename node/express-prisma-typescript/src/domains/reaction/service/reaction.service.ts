export interface ReactionService {
  create: (userId: string, postId: string, reactionType: string) => Promise<void>
  delete: (userId: string, postId: string, reactionType: string) => Promise<void>
}
