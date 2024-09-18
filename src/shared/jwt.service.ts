import { Injectable, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

type TokenPayload = {
  userId: string
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
  REFRESH_SECRET: string
  REFRESH_EXPIRED_TIME: string

  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
    this.isDevelopment =
      this.config.get('NODE_ENV') === 'development' ? true : false

    this.ACCESS_SECRET = this.config.get('JWT_SECRET')
    this.EXPIRED_TIME = this.config.get('JWT_EXPIRED_TIME')
    this.REFRESH_SECRET = this.config.get('JWT_REFRESH_SECRET')
    this.REFRESH_EXPIRED_TIME = this.config.get('JWT_REFRESH_EXPIRED_TIME')
  }

  public createAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.ACCESS_SECRET,
      expiresIn: this.EXPIRED_TIME,
    })
  }

  public createRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.REFRESH_SECRET,
      expiresIn: this.REFRESH_EXPIRED_TIME,
    })
  }

  public genToken(payload: TokenPayload) {
    return {
      access_token: this.createAccessToken(payload),
      refresh_token: this.createRefreshToken(payload),
    }
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

  public async refreshToken(refresh_token: string) {
    const payload: TokenPayload = await this.jwtService.verifyAsync(
      refresh_token,
      {
        secret: this.REFRESH_SECRET,
      },
    )
    return this.createAccessToken({ userId: payload.userId })
  }

  public emailToken(payload: Invitetoken) {
    return this.jwtService.sign(payload, {
      secret: this.ACCESS_SECRET,
      expiresIn: 60 * 5 * 1000,
    })
  }

  public async verifyEmailToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.ACCESS_SECRET,
    })
    return payload as Invitetoken
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
