import { Router } from 'express'
import { ReactionRepositoryImpl } from '../repository'
import { db, validateReactionBody } from '@utils'
import { ReactionServiceImpl } from '../service'
import 'express-async-errors'
import httpStatus from 'http-status'

export const reactionRouter = Router()

const reactionRepository = new ReactionRepositoryImpl(db)
const reactionService = new ReactionServiceImpl(reactionRepository)

reactionRouter.post('/:postId', validateReactionBody, async (req, res) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const { reactionType } = req.body
  await reactionService.create(userId, postId, reactionType)
  res.sendStatus(httpStatus.CREATED)
})

reactionRouter.delete('/:postId', validateReactionBody, async (req, res) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const { reactionType } = req.body
  await reactionService.delete(userId, postId, reactionType)
  res.sendStatus(httpStatus.OK)
})

reactionRouter.get('/likes/:userId', async (req, res) => {
  const { userId } = req.params
  const likes = await reactionService.getLikesByUserId(userId)
  res.status(httpStatus.OK).json(likes)
})

reactionRouter.get('/retweets/:userId', async (req, res) => {
  const { userId } = req.params
  const retweets = await reactionService.getRetweetsByUserId(userId)
  res.status(httpStatus.OK).json(retweets)
})
