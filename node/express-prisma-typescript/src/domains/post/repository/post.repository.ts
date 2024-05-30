import { CursorPagination } from '@types'
import { CreatePostInputDTO, PostDTO } from '../dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  getAllByDatePaginated: (options: CursorPagination) => Promise<PostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<PostDTO | null>
  getByAuthorId: (authorId: string) => Promise<PostDTO[]>
  getAuthorAccountTypeByPostId: (postId: string) => Promise<string>
  getAuthorAccountTypeByAuthorId: (authorId: string) => Promise<string>
  getAuthorFollowersByPostId: (postId: string) => Promise<string[]>
  getAuthorFollowersByAuthorId: (authorId: string) => Promise<string[]>
  comment: (userId: string, data: CreatePostInputDTO, postId: string) => Promise<PostDTO>
  getCommentsByUserId: (userId: string) => Promise<PostDTO[]>
}
