import { chatRouter } from '@domains/chat'
import { MessageServiceImpl } from '../service/message.service.impl'
import { MessageRepositoryImpl } from '../repository/message.repository.impl'
import { db } from '@utils'

const messageService = new MessageServiceImpl(new MessageRepositoryImpl(db))

chatRouter.delete('/message/:messageId', async (req, res) => {
  const { messageId } = req.params
  const { userId } = res.locals.context

  await messageService.deleteMessage(messageId, userId)

  res.sendStatus(200)
})
