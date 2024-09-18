import { ResponseDTO } from '@/shared/dto'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { Logger } from 'nestjs-pino'

@Catch()
export class AllExceptionFilter<T = any> implements ExceptionFilter<T> {
  constructor(private logger: Logger) {}

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<FastifyReply>()

    let statusCode = 500
    let error = 'Internal server error'
    let message: string | string[] = 'Internal server error'

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
      error = exception.message
      const response = exception.getResponse() as any
      message = response.message
    }

    if (statusCode >= 500) {
      this.logger.error(exception)
    } else {
      this.logger.warn(exception)
    }

    res.status(statusCode).send(
      new ResponseDTO({
        success: false,
        statusCode,
        error,
        message,
      }),
    )
  }
}
