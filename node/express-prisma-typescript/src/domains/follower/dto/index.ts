export class FollowDTO {
  constructor (follow: FollowDTO) {
    this.id = follow.id
    this.followerId = follow.followerId
    this.followedId = follow.followedId
    this.createdAt = follow.createdAt
  }

  id: string
  followerId: string
  followedId: string
  createdAt: Date
}

export class FollowInputDTO {
  followerId!: string
  followedId!: string

  constructor (follow: FollowInputDTO) {
    this.followerId = follow.followerId
    this.followedId = follow.followedId
  }
}
