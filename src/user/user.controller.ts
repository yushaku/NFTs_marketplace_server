import { JwtDecoded, JwtUser } from '@/shared/decorators'
import { JwtAuthGuard } from '@/shared/guard/auth.guard'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'

@ApiBearerAuth()
@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('info')
  @UseGuards(JwtAuthGuard)
  info(@JwtUser() { address }: JwtDecoded) {
    return this.userService.userInfo(address)
  }
}
