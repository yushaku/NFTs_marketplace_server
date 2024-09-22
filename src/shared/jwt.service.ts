import { Injectable, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Role } from '@prisma/client'

type TokenPayload = {
  address: string
  role: Role
}

export type Invitetoken = {
  email: string
  password: string
  name?: string
}

@Injectable({ scope: Scope.REQUEST })
export class JWTService {
  isDevelopment = true

  ACCESS_SECRET: string
  EXPIRED_TIME: string

  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
    this.isDevelopment =
      this.config.get('NODE_ENV') === 'development' ? true : false

    this.ACCESS_SECRET = this.config.get('JWT_SECRET')
    this.EXPIRED_TIME = this.config.get('JWT_EXPIRED_TIME')
  }

  public createAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.ACCESS_SECRET,
      expiresIn: this.EXPIRED_TIME,
    })
  }

  public async validateToken(token: string) {
    try {
      const user = await this.jwtService.verify(token, {
        secret: this.ACCESS_SECRET,
      })
      return user
    } catch (error) {
      return null
    }
  }

  option() {
    return {
      httpOnly: true,
      sameSite: this.isDevelopment ? 'lax' : 'strict',
      secure: this.isDevelopment ? false : true,
      path: '/',
    }
  }
}
