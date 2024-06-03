import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db } from '@utils'

import { UserRepositoryImpl } from '../repository'
import { UserService, UserServiceImpl } from '../service'

export const userRouter = Router()

// Use dependency injection
const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db))

userRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, skip } = req.query as Record<string, string>

  const users = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) })

  return res.status(HttpStatus.OK).json(users)
})

userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const user = await service.getUser(userId, userId)

  return res.status(HttpStatus.OK).json(user)
})

userRouter.get('/followers', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const followers = await service.getFollowers(userId)

  return res.status(HttpStatus.OK).json(followers)
})

userRouter.get('/follows', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const follows = await service.getFollows(userId)

  return res.status(HttpStatus.OK).json(follows)
})

userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: otherUserId } = req.params

  const user = await service.getUser(otherUserId, userId)

  return res.status(HttpStatus.OK).json(user)
})

userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  await service.deleteUser(userId)

  return res.status(HttpStatus.OK)
})

userRouter.put('/switch-account-type', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  await service.switchAccountType(userId)

  return res.status(HttpStatus.OK)
})

userRouter.post('/upload-profile-picture', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const url = await service.uploadProfilePicture(userId)

  return res.status(HttpStatus.OK).send(url)
})

userRouter.get('/by_username/:username', async (req: Request, res: Response) => {
  const { username } = req.params
  const { limit, skip } = req.query as Record<string, string>

  const users = await service.getUsersFilteredByUsername(username, { limit: Number(limit), skip: Number(skip) })

  return res.status(HttpStatus.OK).json(users)
})
