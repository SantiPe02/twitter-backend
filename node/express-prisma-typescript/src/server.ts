import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { Constants, NodeEnv, Logger } from '@utils'
import { router } from '@router'
import { ErrorHandling } from '@utils/errors'
import { createServer } from 'http'
import { SocketService } from '@domains/chat'
import swaggerUi from 'swagger-ui-express'
import swaggerSetup from './swagger/index'

const app = express()

// Set up request logger
if (Constants.NODE_ENV === NodeEnv.DEV) {
  app.use(morgan('tiny')) // Log requests only in development environments
}

// Set up request parsers
app.use(express.json()) // Parses application/json payloads request bodies
app.use(express.urlencoded({ extended: false })) // Parse application/x-www-form-urlencoded request bodies
app.use(cookieParser()) // Parse cookies

// Set up CORS
app.use(
  cors({
    origin: Constants.CORS_WHITELIST
  })
)

app.use('/api', router)
app.use('/api/swagger-doc', swaggerUi.serve, swaggerUi.setup(swaggerSetup))

app.use(ErrorHandling)

app.listen(Constants.PORT, () => {
  Logger.info(`Server listening on port ${Constants.PORT}`)
  Logger.info('Swagger documentation running on http://twitter-backend-production-39ba.up.railway.app')
})

const socketServer = createServer(app)

const ioServer = new SocketService(socketServer)
ioServer.init()

socketServer.listen(Constants.WS_PORT, () => {
  Logger.info(`Socket server listening on port ${Constants.WS_PORT}`)
})
