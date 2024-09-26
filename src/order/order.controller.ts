import { JwtDecoded, JwtUser } from '@/shared/decorators'
import { PaginationDto } from '@/shared/dto'
import { JwtAuthGuard } from '@/shared/guard'
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderService } from './order.service'

@ApiTags('Order')
@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@JwtUser() { address }: JwtDecoded, @Query() query: PaginationDto) {
    return this.orderService.findAll(address, query)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  find(@JwtUser() { address }: JwtDecoded, @Param('id') id: string) {
    return this.orderService.getOrderDetail(address, id)
  }

  @Post()
  addCart(
    @Body() createOrderDto: CreateOrderDto,
    @JwtUser() { address }: JwtDecoded,
  ) {
    return this.orderService.create(createOrderDto, address)
  }
}
