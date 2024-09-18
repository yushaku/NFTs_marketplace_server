import { JwtDecoded, JwtUser } from '@/shared/decorators'
import { JwtAuthGuard } from '@/shared/guard/auth.guard'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { PaginationDto } from '@/shared/dto'

@ApiBearerAuth()
@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('info')
  @UseGuards(JwtAuthGuard)
  info(@JwtUser() { userId }: JwtDecoded) {
    return this.userService.userInfo(userId)
  }

  @Get('1/posts')
  post1(@Query() query: PaginationDto) {
    return this.userService.getPostsNoCache(query)
  }
  @Get('2/posts')
  postWithCache(@Query() query: PaginationDto) {
    return this.userService.getPostsWithCache(query)
  }

  @Get('3/posts')
  postWithPromiseCache(@Query() query: PaginationDto) {
    return this.userService.getPostsWithPromiseCache(query)
  }
}
