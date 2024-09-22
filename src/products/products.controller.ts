import { PaginationDto } from '@/shared/dto'
import { AdminGuard } from '@/shared/guard'
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { ProductsService } from './products.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.productsService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id)
  }

  // @Patch(':id')
  // @UseGuards(AdminGuard)
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(+id, updateProductDto)
  // }
  //
  // @Delete(':id')
  // @UseGuards(AdminGuard)
  // remove(@Param('id') id: string) {
  //   return this.productsService.remove(+id)
  // }
}
