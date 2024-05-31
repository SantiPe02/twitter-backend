import { CreatePostInputDTO } from '@domains/post/dto'
import { PostRepositoryImpl } from '@domains/post/repository'
import { PostServiceImpl } from '@domains/post/service'
import { BodyValidation, db } from '@utils'
import { Router } from 'express'
import HttpStatus from 'http-status'

export const commentRouter = Router()

const service = new PostServiceImpl(new PostRepositoryImpl(db))

commentRouter.post('/:postId', BodyValidation(CreatePostInputDTO), async (req, res) => {
  const { postId } = req.params
  const { userId } = res.locals.context
  const data = req.body

  const post = await service.commentPost(userId, data, postId)

  res.status(HttpStatus.CREATED).json(post)
})

commentRouter.delete('/:postId', async (req, res) => {
  const { postId } = req.params
  const { userId } = res.locals.context

  await service.deletePost(userId, postId)

  res.status(HttpStatus.OK).send(`Deleted comment ${postId}`)
})

commentRouter.get('/user/:userId', async (req, res) => {
  const { userId } = req.params

  const posts = await service.getCommentsByUserId(userId)

  res.status(HttpStatus.OK).json(posts)
})

commentRouter.get('/:postId', async (req, res) => {
  const { postId } = req.params
  const { limit, before, after } = req.query as Record<string, string>

  const comments = await service.getCommentsByPostId(postId, { limit: Number(limit), before, after })

  res.status(HttpStatus.OK).json(comments)
})
