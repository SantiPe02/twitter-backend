import { Router } from 'express'
import { FollowerService, FollowerServiceImpl } from '../service'
import { FollowerRepositoryImpl } from '../repository'
import { db } from '@utils'
import HttpStatus from 'http-status'
import 'express-async-errors'

export const followRouter = Router()

const service: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db))

followRouter.post('/follow/:userId', async (req, res) => {
  const { userId: followerId } = res.locals.context
  const { userId: followedId } = req.params
  const follow = await service.follow(followerId, followedId)
  return res.status(HttpStatus.CREATED).json(follow)
})

followRouter.delete('/unfollow/:userId', async (req, res) => {
  const { userId: followerId } = res.locals.context
  const { userId: followedId } = req.params
  await service.unfollow(followerId, followedId)
  return res.status(HttpStatus.OK).send(`Unfollowed user ${followedId}`)
})
