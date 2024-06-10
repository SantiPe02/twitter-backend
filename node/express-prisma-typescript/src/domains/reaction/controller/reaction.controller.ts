import { Router } from 'express'
import { ReactionRepositoryImpl } from '../repository'
import { db, validateReactionBody } from '@utils'
import { ReactionServiceImpl } from '../service'
import 'express-async-errors'

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

reactionRouter.get('/likes/:userId', async (req, res) => {
  const { userId } = req.params
  const likes = await reactionService.getLikesByUserId(userId)
  res.status(200).json(likes)
})

reactionRouter.get('/retweets/:userId', async (req, res) => {
  const { userId } = req.params
  const retweets = await reactionService.getRetweetsByUserId(userId)
  res.status(200).json(retweets)
})
