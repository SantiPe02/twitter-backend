import { Router } from 'express'
import { ChatServiceImpl } from '../service/chat.service.impl'
import { ChatRepositoryImpl } from '../repository/chat.repository.impl'
import { db, validateChatCreationBody, validateChatUserBody, validateMessageBody } from '@utils'
import HttpStatus from 'http-status'

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
