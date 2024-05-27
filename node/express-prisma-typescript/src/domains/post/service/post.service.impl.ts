import { CreatePostInputDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFoundException } from '@utils'
import { CursorPagination } from '@types'

export class PostServiceImpl implements PostService {
  constructor (private readonly repository: PostRepository) {}

  async createPost (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data)
    return await this.repository.create(userId, data)
  }

  async deletePost (userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()
    await this.repository.delete(postId)
  }

  async getPost (userId: string, postId: string): Promise<PostDTO> {
    const authorAccountType = await this.repository.getAuthorAccountTypeByPostId(postId)
    if (authorAccountType === 'PRIVATE') {
      const authorFollowers = await this.repository.getAuthorFollowersByPostId(postId)
      if (!authorFollowers.includes(userId)) throw new NotFoundException()
    }
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    return post
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<PostDTO[]> {
    const allPosts = await this.repository.getAllByDatePaginated(options)
    const postsWithAuthorData = await Promise.all(allPosts.map(async post => {
      const authorAccountType = await this.repository.getAuthorAccountTypeByPostId(post.id)
      if (authorAccountType === 'PRIVATE') {
        const authorFollowers = await this.repository.getAuthorFollowersByPostId(post.id)
        return authorFollowers.includes(userId) ? post : null
      }
      return post
    }))
    return postsWithAuthorData.filter((post): post is PostDTO => post !== null)
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<PostDTO[]> {
    const authorAccountType = await this.repository.getAuthorAccountTypeByAuthorId(authorId)
    if (authorAccountType === 'PRIVATE') {
      const authorFollowers = await this.repository.getAuthorFollowersByAuthorId(authorId)
      if (!authorFollowers.includes(userId)) throw new NotFoundException()
    }
    return await this.repository.getByAuthorId(authorId)
  }
}
