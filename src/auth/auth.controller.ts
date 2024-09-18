import { TOKEN } from '@/shared/constant'
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiTags } from '@nestjs/swagger'
import { ThrottlerGuard } from '@nestjs/throttler'
import { FastifyReply } from 'fastify'
import { AuthService } from './auth.service'
import { UserDto } from './dto/user.dto'

@ApiTags('Authentication')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  private isDevelopment: boolean

  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {
    this.isDevelopment =
      this.config.get('NODE_ENV') === 'development' ? true : false
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() userDto: UserDto) {
    return this.authService.login(userDto)
  }

  protected setToken(res: FastifyReply, { access_token, refresh_token }) {
    res.cookie(TOKEN.ACCESS, access_token, {
      httpOnly: true,
      sameSite: this.isDevelopment ? 'lax' : 'strict',
      secure: this.isDevelopment ? false : true,
      path: '/',
    })
    res.cookie(TOKEN.REFRESH, refresh_token, {
      httpOnly: true,
      sameSite: this.isDevelopment ? 'lax' : 'strict',
      secure: this.isDevelopment ? false : true,
      path: '/',
    })
  }
}
