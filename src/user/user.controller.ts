import { JwtDecoded, JwtUser } from '@/shared/decorators'
import { JwtAuthGuard } from '@/shared/guard/auth.guard'
import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateAddressDto, UpdateAddressDto } from './dto/user.dto'
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

  @Get('address')
  @UseGuards(JwtAuthGuard)
  address(@JwtUser() { address }: JwtDecoded) {
    return this.userService.getAllAddress(address)
  }

  @Put('address')
  @UseGuards(JwtAuthGuard)
  updateAddress(
    @JwtUser() { address }: JwtDecoded,
    @Body() data: UpdateAddressDto,
  ) {
    return this.userService.updateAddress(address, data)
  }

  @Post('address')
  @UseGuards(JwtAuthGuard)
  addAddress(
    @JwtUser() { address }: JwtDecoded,
    @Body() data: CreateAddressDto,
  ) {
    return this.userService.addAddress(address, data)
  }
}
