import { prismaMock } from '../../testconfig/singleton'
import { PostServiceImpl } from '../../domains/post/service/post.service.impl'
import { PostRepositoryImpl } from '../../domains/post/repository/post.repository.impl'
import { AccountType, Post } from '@prisma/client'
import { CreatePostInputDTO, ExtendedPostDTO } from '@domains/post/dto'
import { ForbiddenException, NotFoundException, ValidationException } from '@utils'

const postService = new PostServiceImpl(new PostRepositoryImpl(prismaMock))

const postuuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
const authoruuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d478'

const postMock: Post = {
  id: postuuid,
  authorId: authoruuid,
  content: 'test content',
  images: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  commentPostReference: null
}

const extendedPostMock: ExtendedPostDTO = {
  id: postuuid,
  authorId: authoruuid,
  content: 'test content',
  images: [],
  createdAt: new Date(),
  commentPostReference: null,
  qtyComments: 0,
  qtyLikes: 0,
  qtyRetweets: 0,
  reactions: [],
  comments: [],
  author: {
    id: authoruuid,
    name: 'Test',
    username: 'test',
    profilePicture: null
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Post Service', () => {
  describe('create', () => {
    it('should return a post', async () => {
      prismaMock.post.create.mockResolvedValue(postMock)

      const createPostInput: CreatePostInputDTO = {
        content: 'test content',
        images: ['image1', 'image2']
      }
      const post = await postService.createPost(authoruuid, createPostInput)

      expect(post).toBeDefined()
    })
    it('should throw an error if content is missing', async () => {
      prismaMock.post.create.mockRejectedValue(new ValidationException([{ content: 'Validation Error' }]))
      const createPostInput: CreatePostInputDTO = {
        content: '',
        images: ['image1', 'image2']
      }

      await expect(postService.createPost(authoruuid, createPostInput)).rejects.toThrow(
        new ValidationException([{ content: 'Validation Error' }])
      )
    })
    it('should throw an error if images are more than 4', async () => {
      prismaMock.post.create.mockRejectedValue(
        new ValidationException([{ images: 'You can only upload up to 4 images' }])
      )

      const createPostInput: CreatePostInputDTO = {
        content: 'test content',
        images: ['image1', 'image2', 'image3', 'image4', 'image5']
      }

      await expect(postService.createPost(authoruuid, createPostInput)).rejects.toThrow(
        new ValidationException([{ images: 'You can only upload up to 4 images' }])
      )
    })
  })

  describe('delete', () => {
    it('should delete a post', async () => {
      prismaMock.post.findUnique.mockResolvedValue(postMock)

      await expect(postService.deletePost(authoruuid, postuuid)).resolves.toBeUndefined()
    })
    it('should throw an error if post does not exist', async () => {
      prismaMock.post.findUnique.mockResolvedValue(null)

      await expect(postService.deletePost(authoruuid, postuuid)).rejects.toThrow(new NotFoundException('post'))
    })
    it('should throw an error if user is not the author', async () => {
      prismaMock.post.findUnique.mockResolvedValue(postMock)
      const wronguuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d477'

      await expect(postService.deletePost(wronguuid, postuuid)).rejects.toThrow(new ForbiddenException())
    })
  })

  describe('get', () => {
    it('should return a post', async () => {
      prismaMock.post.findUnique.mockResolvedValue(postMock)
      prismaMock.post.findFirst.mockResolvedValue(postMock)
      prismaMock.post.findMany.mockResolvedValue([postMock])
      jest.spyOn(PostRepositoryImpl.prototype, 'getAuthorAccountTypeByPostId').mockResolvedValue(AccountType.PUBLIC)
      jest.spyOn(PostServiceImpl.prototype, 'getExtendedPost').mockResolvedValue(extendedPostMock)

      await expect(postService.getPost(authoruuid, postuuid)).resolves.toBeDefined()
    })
    it('should throw an error if post does not exist', async () => {
      prismaMock.post.findUnique.mockResolvedValue(null)

      await expect(postService.getPost(authoruuid, postuuid)).rejects.toThrow(new NotFoundException('post'))
    })
  })
})
