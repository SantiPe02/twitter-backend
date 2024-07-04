import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFoundException, ValidationException, db, getPresignedUrl, validateUuid, generateRandomUuid } from '@utils'
import { CursorPagination } from '@types'
import { ReactionService, ReactionServiceImpl } from '@domains/reaction/service'
import { ReactionRepositoryImpl } from '@domains/reaction/repository'

export class PostServiceImpl implements PostService {
  constructor (private readonly repository: PostRepository) {}

  private readonly reactionService: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db))

  async createPost (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data)

    const imagesIds: string[] = []
    const presignedUrls: string[] = []

    if (data.images) {
      if (data.images.length > 4) throw new ValidationException([{ images: 'You can only upload up to 4 images' }])
      data.images.forEach(async image => {
        const imageId = generateRandomUuid()
        const presignedUrl = await getPresignedUrl(`post/${imageId}`)
        imagesIds.push(imageId)
        presignedUrls.push(presignedUrl)
      })
    }

    const dataWithImages = { ...data, images: imagesIds }

    const post = await this.repository.create(userId, dataWithImages)

    post.images = presignedUrls

    return post
  }

  async deletePost (userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()
    await this.repository.delete(postId)
  }

  async getPost (userId: string, postId: string): Promise<ExtendedPostDTO> {
    validateUuid(postId)
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    const authorAccountType = await this.repository.getAuthorAccountTypeByPostId(postId)
    if (authorAccountType === 'PRIVATE' && post.authorId !== userId) {
      const authorFollowers = await this.repository.getAuthorFollowersByPostId(postId)
      if (!authorFollowers.includes(userId)) throw new NotFoundException()
    }
    return await this.getExtendedPost(post)
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    const allPosts = await this.repository.getAllByDatePaginated(options)
    const postsWithAuthorData = await Promise.all(allPosts.map(async post => {
      const authorAccountType = await this.repository.getAuthorAccountTypeByPostId(post.id)
      if (authorAccountType === 'PRIVATE' && post.authorId !== userId) {
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
    if (userId === authorId) {
      const posts = await this.repository.getByAuthorId(authorId)
      return await Promise.all(posts.map(async post => await this.getExtendedPost(post)))
    }
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

  async getExtendedPost (post: PostDTO): Promise<ExtendedPostDTO> {
    const likes = await this.reactionService.getQtyOfLikes(post.id)
    const retweets = await this.reactionService.getQtyOfRetweets(post.id)
    const author = await this.repository.getAuthorByPostId(post.id)
    const reactions = await this.reactionService.getReactionsByPostId(post.id)
    const comments = await this.repository.getCommentsByPostId(post.id, { limit: 3 })
    const extendedComments = await Promise.all(comments.map(async comment => await this.getExtendedPost(comment)))

    if (!author) throw new NotFoundException('author')

    return new ExtendedPostDTO({ ...post, author, qtyComments: comments.length, qtyLikes: likes, qtyRetweets: retweets, reactions, comments: extendedComments })
  }

  async getFollowingPosts (userId: string): Promise<ExtendedPostDTO[]> {
    const myFollows = await this.repository.getFollowing(userId)
    const posts = await Promise.all(myFollows.map(async follow => await this.repository.getByAuthorId(follow.id)))
    const postsWithReactionsData = await Promise.all(
      posts.flat().map(
        async post => await this.getExtendedPost(post)
      ))

    return postsWithReactionsData
  }
}
