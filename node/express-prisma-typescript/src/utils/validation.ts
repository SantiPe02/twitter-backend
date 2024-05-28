import { validate } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { ValidationException } from './errors'
import { plainToInstance } from 'class-transformer'
import { ClassType } from '@types'
import uuidValidate from 'uuid-validate'

export function BodyValidation<T> (target: ClassType<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    req.body = plainToInstance(target, req.body)
    const errors = await validate(req.body, {
      whitelist: true,
      forbidNonWhitelisted: true
    })

    if (errors.length > 0) {
      throw new ValidationException(errors.map((error) => ({ ...error, target: undefined, value: undefined })))
    }

    next()
  }
}

export const validateReactionBody = (req: Request, res: Response, next: NextFunction): void => {
  const reactionType: string | undefined = req.body.reactionType

  if (!reactionType) {
    throw new ValidationException([
      { property: 'reactionType', constraints: { isDefined: 'reactionType should be defined' } }
    ])
  }

  if (reactionType !== 'LIKE' && reactionType !== 'RETWEET') {
    throw new ValidationException([
      { property: 'reactionType', constraints: { isDefined: 'reactionType should be either LIKE or RETWEET' } }
    ])
  }

  next()
}

export const validateUuid = (uuid: string): void => {
  if (!uuidValidate(uuid)) {
    console.log('entra aca')
    throw new ValidationException([{ property: 'uuid', constraints: { isDefined: 'uuid should be a valid uuid' } }])
  }
}
