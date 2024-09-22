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
import { Role } from '@prisma/client'

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(private authService: JWTService) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()

    try {
      const accessToken = ExtractJwt.fromExtractors([this.cookieExtractor])(
        request,
      )

      if (!accessToken)
        throw new UnauthorizedException('Access token is not set')

      const payload = await this.authService.validateToken(accessToken)

      if (payload && payload.role === Role.admin) {
        return this.activate(context)
      } else {
        throw new UnauthorizedException('Insufficient role permissions')
      }
    } catch (error) {
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
