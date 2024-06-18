export class MessageDTO {
  id: string
  senderId: string
  chatId: string
  content: string
  date: Date

  constructor (message: MessageDTO) {
    this.id = message.id
    this.senderId = message.senderId
    this.chatId = message.chatId
    this.content = message.content
    this.date = message.date
  }
}

export class SendMessageDTO {
  chatId: string
  senderId: string
  content: string

  constructor (message: SendMessageDTO) {
    this.chatId = message.chatId
    this.senderId = message.senderId
    this.content = message.content
  }
}
