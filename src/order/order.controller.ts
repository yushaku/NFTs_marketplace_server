import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'
import { OrderService } from './order.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/shared/guard'
import { JwtDecoded, JwtUser } from '@/shared/decorators'
import { PaginationDto } from '@/shared/dto'

@ApiTags('Order')
@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('carts')
  @UseGuards(JwtAuthGuard)
  findCarts(@JwtUser() { address }: JwtDecoded, @Query() query: PaginationDto) {
    return this.orderService.getUserCarts(address, query)
  }

  @Post('carts')
  addCart(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto)
  }

  @Delete('carts')
  removeCart(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id)
  }
}
