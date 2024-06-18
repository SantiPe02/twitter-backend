import { ReactionType } from '@prisma/client'

export class ReactionDTO {
  constructor (reaction: ReactionDTO) {
    this.id = reaction.id
    this.userId = reaction.userId
    this.postId = reaction.postId
    this.reactionType = reaction.reactionType
  }

  id: string
  userId: string
  postId: string
  reactionType: ReactionType
}

export class ReactionInputDTO {
  constructor (reaction: ReactionInputDTO) {
    this.userId = reaction.userId
    this.postId = reaction.postId
    this.reactionType = reaction.reactionType
  }

  userId: string
  postId: string
  reactionType: ReactionType
}
