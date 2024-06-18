export class ChatUserDTO {
  userId: string
  chatId: string

  constructor (relation: { userId: string, chatId: string }) {
    this.userId = relation.userId
    this.chatId = relation.chatId
  }
}
