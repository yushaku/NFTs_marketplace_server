import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { FastifyRequest } from 'fastify'
import { ExtractJwt } from 'passport-jwt'

import { TOKEN } from '@/shared/constant'
import { JWTService } from '@/shared/jwt.service'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: JWTService) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()

    try {
      const accessToken = ExtractJwt.fromExtractors([this.cookieExtractor])(
        request,
      )

      if (!accessToken)
        throw new UnauthorizedException('Access token is not set')

      const isOk = await this.authService.validateToken(accessToken)
      if (isOk) return this.activate(context)

      const refreshToken = request.cookies[TOKEN.REFRESH]
      if (!refreshToken)
        throw new UnauthorizedException('Refresh token is not set')

      const newToken = await this.authService.refreshToken(refreshToken)
      if (!newToken)
        throw new UnauthorizedException('Refresh token is not valid')

      const jwtOption = this.authService.option()
      response.cookie(TOKEN.ACCESS, newToken, jwtOption)
      request.cookies[TOKEN.ACCESS] = newToken

      return this.activate(context)
    } catch (error) {
      response.clearCookie(TOKEN.ACCESS)
      response.clearCookie(TOKEN.REFRESH)

      return false
    }
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }

  cookieExtractor = (request: FastifyRequest): string | null => {
    let token = null
    if (request && request.cookies) {
      token = request.cookies[TOKEN.ACCESS]
    }
    return token
  }
}
