import { Router } from 'express'
import { ReactionRepositoryImpl } from '../repository'
import { db, validateReactionBody } from '@utils'
import { ReactionServiceImpl } from '../service'

export const reactionRouter = Router()

const reactionRepository = new ReactionRepositoryImpl(db)
const reactionService = new ReactionServiceImpl(reactionRepository)

reactionRouter.post('/:postId', validateReactionBody, async (req, res) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const { reactionType } = req.body
  await reactionService.create(userId, postId, reactionType)
  res.sendStatus(200)
})

reactionRouter.delete('/:postId', validateReactionBody, async (req, res) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const { reactionType } = req.body
  await reactionService.delete(userId, postId, reactionType)
  res.sendStatus(200)
})
