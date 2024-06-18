import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFoundException, ValidationException, db, getPresignedUrl, validateUuid } from '@utils'
import { CursorPagination } from '@types'
import { ReactionService, ReactionServiceImpl } from '@domains/reaction/service'
import { ReactionRepositoryImpl } from '@domains/reaction/repository'

export class PostServiceImpl implements PostService {
  constructor (private readonly repository: PostRepository) {}

  private readonly reactionService: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db))

  async createPost (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data)

    const presignedUrls: string[] = []

    if (data.images) {
      if (data.images.length > 4) throw new ValidationException([{ images: 'You can only upload up to 4 images' }])
      data.images.forEach(async image => {
        const presignedUrl = await getPresignedUrl(`post-image-${image}-user-${userId}-date-${new Date().toISOString()}`)
        presignedUrls.push(presignedUrl)
      })
      data.images = presignedUrls
    }

    return await this.repository.create(userId, data)
  }

  async deletePost (userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()
    await this.repository.delete(postId)
  }

  async getPost (userId: string, postId: string): Promise<PostDTO> {
    validateUuid(postId)
    const authorAccountType = await this.repository.getAuthorAccountTypeByPostId(postId)
    if (authorAccountType === 'PRIVATE') {
      const authorFollowers = await this.repository.getAuthorFollowersByPostId(postId)
      if (!authorFollowers.includes(userId)) throw new NotFoundException()
    }
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    return post
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    const allPosts = await this.repository.getAllByDatePaginated(options)
    const postsWithAuthorData = await Promise.all(allPosts.map(async post => {
      const authorAccountType = await this.repository.getAuthorAccountTypeByPostId(post.id)
      if (authorAccountType === 'PRIVATE') {
        const authorFollowers = await this.repository.getAuthorFollowersByPostId(post.id)
        return authorFollowers.includes(userId) ? post : null
      }
      return post
    }))

    const extendedPosts = await Promise.all(
      postsWithAuthorData.filter(post => post !== null).map(
        async post => await this.getExtendedPost(post as PostDTO)
      ))
    return extendedPosts
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<ExtendedPostDTO[]> {
    validateUuid(authorId)
    const authorAccountType = await this.repository.getAuthorAccountTypeByAuthorId(authorId)
    if (authorAccountType === 'PRIVATE') {
      const authorFollowers = await this.repository.getAuthorFollowersByAuthorId(authorId)
      if (!authorFollowers.includes(userId)) throw new NotFoundException()
    }
    const posts = await this.repository.getByAuthorId(authorId)
    const postsWithReactionsData = await Promise.all(
      posts.map(
        async post => await this.getExtendedPost(post)
      ))
    return postsWithReactionsData
  }

  async commentPost (userId: string, data: CreatePostInputDTO, postId: string): Promise<PostDTO> {
    await validate(data)
    validateUuid(postId)
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    return await this.repository.comment(userId, data, postId)
  }

  async getCommentsByUserId (userId: string): Promise<PostDTO[]> {
    validateUuid(userId)
    return await this.repository.getCommentsByUserId(userId)
  }

  async getCommentsByPostId (postId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    validateUuid(postId)
    const comments = await this.repository.getCommentsByPostId(postId, options)

    const commentsWithReactionsData = await Promise.all(
      comments.map(
        async comment => await this.getExtendedPost(comment)
      ))

    return commentsWithReactionsData.sort((a, b) => a.qtyLikes + a.qtyRetweets - b.qtyLikes - b.qtyRetweets).reverse()
  }

  private async getExtendedPost (post: PostDTO): Promise<ExtendedPostDTO> {
    const likes = await this.reactionService.getQtyOfLikes(post.id)
    const retweets = await this.reactionService.getQtyOfRetweets(post.id)
    const author = await this.repository.getAuthorByPostId(post.id)
    const comments = await this.repository.getQtyOfComments(post.id)

    if (!author) throw new NotFoundException('author')

    return new ExtendedPostDTO({ ...post, author, qtyComments: comments, qtyLikes: likes, qtyRetweets: retweets })
  }
}
