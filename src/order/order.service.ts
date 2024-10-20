import { SHOP_PAYMENT_ABI } from '@/abi/shopPayment'
import { PrismaService } from '@/prisma.service'
import { ChainLinkService } from '@/shared/ChainLink.service'
import { RPC } from '@/shared/constant'
import { PaginationDto } from '@/shared/dto'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Decimal } from '@prisma/client/runtime/library'
import { Contract, parseUnits } from 'ethers'
import { CreateOrderDto, DeleteOrderDto } from './dto/create-order.dto'

@Injectable()
export class OrderService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private LinkPriceFeed: ChainLinkService,
  ) {}

  async create({ products, address_id }: CreateOrderDto, user_wallet: string) {
    const existedProduct = await this.prisma.product.findMany({
      where: {
        product_id: {
          in: products.map((item) => item.product_id),
        },
      },
    })

    const setIds = new Set(existedProduct.map((item) => item.product_id))
    products.forEach((prod) => {
      if (!setIds.has(prod.product_id)) {
        throw new BadRequestException('Product not found')
      }
    })

    const tokenPrice = await this.LinkPriceFeed.getPrice('BNB')

    const totalMoney = existedProduct.reduce((total, item) => {
      const product = products.find((p) => p.product_id === item.product_id)
      return item.price.times(product.quantity).add(total)
    }, new Decimal(0))

    const order = await this.prisma.order.create({
      data: {
        user_wallet,
        total_amount: totalMoney,
        price_in_token: totalMoney.dividedBy(new Decimal(tokenPrice)),
        shipping_address_id: address_id,
        encoded: '',
      },
      select: {
        order_id: true,
        price_in_token: true,
      },
    })

    const orderList = products.map((item) => {
      const unitPrice = existedProduct.find(
        (i) => i.product_id === item.product_id,
      ).price

      const total_price = unitPrice.times(item.quantity)
      return {
        order_id: order.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price,
        price_in_token: total_price
          .dividedBy(new Decimal(tokenPrice))
          .toFixed(5),
      }
    })
    await this.prisma.orderItem.createMany({ data: orderList })

    const contract = new Contract(
      RPC[this.config.get('THE_CHAIN_ID')].shopPayment,
      SHOP_PAYMENT_ABI,
    )

    const data = contract.interface.encodeFunctionData('createAndPayOrder', [
      order.order_id,
      parseUnits(order.price_in_token.toString(), 'ether'),
    ])

    await this.prisma.order.update({
      where: { order_id: order.order_id },
      data: {
        encoded: data,
      },
    })

    return {
      encodeData: data,
      unit: 'BNB',
      order,
      orderList,
    }
  }

  async findAll(user_wallet: string, { page, perPage }: PaginationDto) {
    const [total, orders] = await this.prisma.$transaction([
      this.prisma.order.count({ where: { user_wallet } }),
      this.prisma.order.findMany({
        where: { user_wallet },
        take: perPage,
        include: {
          order_items: {
            include: {
              product: {
                select: {
                  name: true,
                  banner: true,
                },
              },
            },
          },
        },
        skip: (page - 1) * perPage,
      }),
    ])

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

  async delete({ order_ids }: DeleteOrderDto, user_wallet: string) {
    const order = await this.prisma.order.deleteMany({
      where: {
        order_id: {
          in: order_ids,
        },
        user_wallet,
      },
    })

    return {
      message: 'Delete success',
      order,
    }
  }
}
