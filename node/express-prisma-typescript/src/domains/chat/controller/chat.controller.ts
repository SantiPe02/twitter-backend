import { Router } from 'express'
import { ChatServiceImpl } from '../service/chat.service.impl'
import { ChatRepositoryImpl } from '../repository/chat.repository.impl'
import { Constants, db, validateChatCreationBody, validateChatUserBody, validateMessageBody } from '@utils'
import HttpStatus from 'http-status'
import { Server } from 'http'
import io from 'socket.io'
import jwt from 'jsonwebtoken'

export const chatRouter = Router()
const chatService = new ChatServiceImpl(new ChatRepositoryImpl(db))

chatRouter.get('/:chatId', async (req, res) => {
  const { chatId } = req.params
  const { userId } = res.locals.context

  const chat = await chatService.getChatById(chatId, userId)

  res.status(HttpStatus.OK).json(chat)
})

chatRouter.post('/:chatId', validateMessageBody, async (req, res) => {
  const { userId } = res.locals.context
  const { content } = req.body
  const { chatId } = req.params

  const message = await chatService.sendMessageToChat(chatId, userId, content)

  res.status(HttpStatus.OK).json(message)
})

chatRouter.post('/', validateChatCreationBody, async (req, res) => {
  const { name } = req.body
  const { userId } = res.locals.context

  const chat = await chatService.createChat(name)
  await chatService.joinChat(userId, chat.id)

  res.status(HttpStatus.CREATED).json(chat)
})

chatRouter.delete('/:chatId', async (req, res) => {
  const { chatId } = req.params
  const { userId } = res.locals.context

  await chatService.deleteChat(chatId, userId)

  res.status(HttpStatus.OK).send(`Deleted chat ${chatId}`)
})

chatRouter.post('/add-user/:chatId', validateChatUserBody, async (req, res) => {
  const { chatId } = req.params
  const { userId } = req.body
  const { userId: currentUserId } = res.locals.context

  await chatService.joinChat(userId, chatId, currentUserId)

  res.status(HttpStatus.OK).send(`User ${userId as string} joined chat ${chatId}`)
})

chatRouter.delete('/remove-user/:chatId', validateChatUserBody, async (req, res) => {
  const { chatId } = req.params
  const { userId } = req.body
  const { userId: currentUserId } = res.locals.context

  await chatService.leaveChat(userId, chatId, currentUserId)

  res.status(HttpStatus.OK).send(`User ${userId as string} left chat ${chatId}`)
})

chatRouter.delete('/leave/:chatId', async (req, res) => {
  const { chatId } = req.params
  const { userId } = res.locals.context

  await chatService.leaveChat(userId, chatId)

  res.status(HttpStatus.OK).send(`Left chat ${chatId}`)
})

export class SocketService {
  server: Server
  constructor (server: Server) {
    this.server = server
  }

  public init (): void {
    const socketIO = new io.Server(this.server, {
      cors: {
        origin: Constants.CORS_WHITELIST
      }
    })

    socketIO.on('connection', (socket) => {
      console.log('Socket connected')
      let chatId = ''
      const token = socket.handshake.headers.authorization?.split(' ')[1]
      const { userId } = jwt.verify(token as string, Constants.TOKEN_SECRET) as { userId: string }

      socket.on('join', (room) => {
        void socket.join(room)
        chatId = room
        console.log('Joined room', chatId)
      })

      socket.on('leave', (room) => {
        void socket.leave(room)
        chatId = ''
      })

      socket.on('message', async (message) => {
        try {
          console.log(chatId, userId, message)
          await chatService.sendMessageToChat(chatId, userId, message)
          socket.to(chatId).emit('message', message)
        } catch (err) {
          console.error(err)
        }
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected')
      })
    })
  }
}
