import { Injectable } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { PrismaService } from '@/prisma.service'
import { PaginationDto } from '@/shared/dto'
import { Decimal } from '@prisma/client/runtime/library'

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create({ products }: CreateOrderDto, user_wallet: string) {
    const items = await this.prisma.product.findMany({
      where: {
        product_id: {
          in: products.map((item) => item.product_id),
        },
      },
    })

    const totalMoney = items.reduce((total, item) => {
      const product = products.find((p) => p.product_id === item.product_id)
      return item.price.times(product.quantity).add(total)
    }, new Decimal(0))

    const order = await this.prisma.order.create({
      data: {
        user_wallet,
        total_amount: totalMoney,
        shipping_address_id: 1,
      },
      select: {
        order_id: true,
      },
    })

    await this.prisma.orderItem.createMany({
      data: products.map((item) => {
        const unitPrice = items.find(
          (i) => i.product_id === item.product_id,
        ).price

        return {
          order_id: order.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: unitPrice,
          total_price: unitPrice.times(item.quantity),
        }
      }),
    })

    return order
  }

  async findAll(user_wallet: string, { page, perPage }: PaginationDto) {
    const total = await this.prisma.order.count({
      where: { user_wallet },
    })

    const orders = await this.prisma.order.findMany({
      where: { user_wallet },
      take: page,
      skip: (page - 1) * perPage,
    })

    return {
      total,
      page,
      perPage,
      data: orders,
    }
  }

  async getOrderDetail(address: string, id: string) {
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        order_id: id,
        order: {
          user_wallet: address,
        },
      },
      include: {
        product: true,
        order: true,
      },
    })

    return orderItems
  }
}
