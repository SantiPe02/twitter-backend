import { v4 } from 'uuid'

export const generateRandomUuid = (): string => {
  return v4()
}
