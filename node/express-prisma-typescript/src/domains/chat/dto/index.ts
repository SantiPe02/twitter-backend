import { MessageDTO } from '@domains/message/dto'
import { UserViewDTO } from '@domains/user/dto'

export class ExtendedChatDTO {
  id: string
  name: string
  messages: MessageDTO[]
  users: UserViewDTO[]

  constructor (chat: ExtendedChatDTO) {
    this.id = chat.id
    this.name = chat.name
    this.messages = chat.messages
    this.users = chat.users
  }
}

export class ChatDTO {
  id: string
  name: string

  constructor (chat: ChatDTO) {
    this.id = chat.id
    this.name = chat.name
  }
}
