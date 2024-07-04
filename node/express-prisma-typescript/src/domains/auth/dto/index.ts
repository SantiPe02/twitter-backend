import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator'

export class TokenDTO {
  token!: string
}

export class SignupInputDTO {
  @IsString()
    name?: string

  @IsString()
  @IsNotEmpty()
  @IsEmail()
    email: string

  @IsString()
  @IsNotEmpty()
    username: string

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
    password: string

  constructor (name: string, email: string, username: string, password: string) {
    this.name = name
    this.email = email
    this.password = password
    this.username = username
  }
}

export class LoginInputDTO {
  @IsOptional()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
    email?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
    username?: string

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
    password!: string
}
