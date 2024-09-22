import { Injectable } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PrismaService } from '@/prisma.service'
import { PaginationDto } from '@/shared/dto'

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    const product = await this.prisma.product.create({ data })

    return {
      product,
    }
  }

  async findAll({ page, perPage }: PaginationDto) {
    const total = await this.prisma.product.count()
    const products = await this.prisma.product.findMany({
      orderBy: { created_at: 'desc' },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return {
      page,
      perPage,
      total,
      data: products,
    }
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({ where: { product_id: id } })
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`
  }

  remove(id: number) {
    return `This action removes a #${id} product`
  }
}
