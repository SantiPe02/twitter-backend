import { PrismaClient } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CreatePostInputDTO, PostDTO } from '../dto'
import { UserViewDTO } from '@domains/user/dto'

export class PostRepositoryImpl implements PostRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        ...data
      }
    })
    return new PostDTO(post)
  }

  async getAllByDatePaginated (options: CursorPagination): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        commentPostReference: null
      },
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ]
    })
    return posts.map(post => new PostDTO(post))
  }

  async delete (postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId
      }
    })
  }

  async getById (postId: string): Promise<PostDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      }
    })
    return (post != null) ? new PostDTO(post) : null
  }

  async getByAuthorId (authorId: string): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        authorId
      }
    })
    return posts.map(post => new PostDTO(post))
  }

  async getAuthorAccountTypeByPostId (postId: string): Promise<string> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      },
      include: {
        author: {
          select: {
            accountType: true
          }
        }
      }
    })
    return post?.author.accountType as string
  }

  async getAuthorAccountTypeByAuthorId (authorId: string): Promise<string> {
    const post = await this.db.post.findFirst({
      where: {
        authorId
      },
      include: {
        author: {
          select: {
            accountType: true
          }
        }
      }
    })
    return post?.author.accountType as string
  }

  async getAuthorFollowersByPostId (postId: string): Promise<string[]> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      },
      include: {
        author: {
          include: {
            followers: true
          }
        }
      }
    })
    return post?.author.followers.map(follower => follower.followerId) ?? []
  }

  async getAuthorFollowersByAuthorId (authorId: string): Promise<string[]> {
    const post = await this.db.post.findFirst({
      where: {
        authorId
      },
      include: {
        author: {
          include: {
            followers: true
          }
        }
      }
    })
    return post?.author.followers.map(follower => follower.followerId) ?? []
  }

  async comment (userId: string, data: CreatePostInputDTO, postId: string): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        commentPostReference: postId,
        ...data
      }
    })
    return new PostDTO(post)
  }

  async getCommentsByUserId (userId: string): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        authorId: userId,
        commentPostReference: {
          not: null
        }
      }
    })
    return posts.map(post => new PostDTO(post))
  }

  async getCommentsByPostId (postId: string, options: CursorPagination): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        commentPostReference: postId
      },
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ]
    })
    return posts.map(post => new PostDTO(post))
  }

  async getAuthorByPostId (postId: string): Promise<UserViewDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      },
      include: {
        author: true
      }
    })
    if (!post) return null
    const data = {
      id: post.authorId,
      name: post.author.name,
      username: post.author.username,
      profilePicture: post.author.profilePicture
    }
    return new UserViewDTO(data)
  }
}
