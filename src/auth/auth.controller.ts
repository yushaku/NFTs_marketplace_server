import { TOKEN } from '@/shared/constant'
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
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
  async login(
    @Body() userDto: UserDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const access_token = await this.authService.login(userDto)
    this.setToken(res, { access_token })
    res.status(200).send({ message: 'Auth Successfully', access_token })
  }

  protected setToken(res: FastifyReply, { access_token }) {
    res.cookie(TOKEN.ACCESS, access_token, {
      httpOnly: true,
      sameSite: this.isDevelopment ? 'lax' : 'strict',
      secure: this.isDevelopment ? false : true,
      path: '/',
    })
  }
}
