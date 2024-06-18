import { prismaMock } from '../../testconfig/singleton'
import { AuthServiceImpl } from '../../domains/auth/service/auth.service.impl'
import { UserRepositoryImpl } from '../../domains/user/repository/user.repository.impl'
import { AccountType, User } from '@prisma/client'
import { LoginInputDTO, SignupInputDTO } from '@domains/auth/dto'
import { ConflictException, NotFoundException, UnauthorizedException, encryptPassword } from '@utils'

const authService = new AuthServiceImpl(new UserRepositoryImpl(prismaMock))

const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'

const userMock: User = {
  id: uuid,
  email: 'test@gmail.com',
  username: 'test',
  password: 'passwordtest',
  name: 'Test',
  profilePicture: null,
  accountType: AccountType.PUBLIC,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}

const signupInput: SignupInputDTO = {
  email: 'authtest@gmail.com',
  username: 'authtest',
  password: 'passwordtest'
}

const loginInput: LoginInputDTO = {
  email: 'test@gmail.com',
  username: 'test',
  password: 'passwordtest'
}

beforeEach(() => {
  jest.clearAllMocks()

  prismaMock.user.create.mockResolvedValue(userMock)
})

describe('Auth Service', () => {
  describe('signup', () => {
    it('should return a token', async () => {
      const token = await authService.signup(signupInput)

      expect(token).toBeDefined()
    })
    it('should throw an error if user already exists', async () => {
      prismaMock.user.findFirst.mockResolvedValue(userMock)

      await expect(authService.signup(signupInput)).rejects.toThrow(new ConflictException('user'))
    })
  })

  describe('login', () => {
    it('should return a token', async () => {
      prismaMock.user.findFirst.mockResolvedValue({ ...userMock, password: await encryptPassword(userMock.password) })

      const token = await authService.login(loginInput)

      expect(token).toBeDefined()
    })

    it('should throw an error if user is not found', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null)

      await expect(authService.login(loginInput)).rejects.toThrow(new NotFoundException('user'))
    })

    it('should throw an error if password is incorrect', async () => {
      prismaMock.user.findFirst.mockResolvedValue(userMock)

      await expect(authService.login({ ...loginInput, password: 'incorrectpassword' })).rejects.toThrow(
        new UnauthorizedException('INCORRECT_PASSWORD')
      )
    })
  })
})
