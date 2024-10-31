import { PrismaService } from '@/prisma.service'
import { QUEUE_LIST, TOPICS } from '@/shared/constant'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { OrderStatus } from '@prisma/client'
import { Job } from 'bullmq'

type PayedOrder = {
  transactionHash: string
  args: [order_id: string, buyer: string, price: string]
}
type CanceledOrder = {
  transactionHash: string
  args: [order_id: string, buyer: string, refundAmount: string]
}

type DeliveredOrder = {
  transactionHash: string
  args: [order_id: string, buyer: string]
}

@Processor(QUEUE_LIST.CONTRACT)
export class ContractConsumer extends WorkerHost {
  logger = new Logger(ContractConsumer.name)

  constructor(private readonly prisma: PrismaService) {
    super()
  }

  async process(job: Job<any, any, string>) {
    console.log(job.data)
    console.log(job.name)

    let transactionHash = ''
    let sender = ''
    let order_id = ''
    let action = ''

    try {
      switch (job.name) {
        case TOPICS.ORDER_PAID: {
          const data = job.data as PayedOrder

          transactionHash = data.transactionHash
          ;[order_id, sender] = data.args
          action = 'ORDER_PAID'
          console.log(action)

          await this.prisma.$transaction([
            this.prisma.order.update({
              where: { order_id },
              data: {
                status: OrderStatus.paid,
              },
            }),
            this.prisma.logs.create({
              data: {
                txhash: transactionHash,
                userAddress: sender,
                action,
              },
            }),
          ])
          break
        }

        case TOPICS.ORDER_CANCELLED: {
          action = 'ORDER_CANCELLED'
          console.log(action)
          const data = job.data as CanceledOrder
          transactionHash = data.transactionHash
          ;[order_id, sender] = data.args

          await this.prisma.$transaction([
            this.prisma.order.update({
              where: { order_id },
              data: {
                status: OrderStatus.cancelled,
              },
            }),
            this.prisma.logs.create({
              data: {
                txhash: data.transactionHash,
                userAddress: sender,
                action,
              },
            }),
          ])
          break
        }

        case TOPICS.ORDER_DELIVERED: {
          const data = job.data as DeliveredOrder

          transactionHash = data.transactionHash
          ;[order_id, sender] = data.args
          action = 'ORDER_DELIVERED'

          await this.prisma.$transaction([
            this.prisma.order.update({
              where: { order_id },
              data: {
                status: OrderStatus.shipped,
              },
            }),
            this.prisma.logs.create({
              data: {
                txhash: transactionHash,
                userAddress: sender,
                action,
              },
            }),
          ])
          break
        }
      }
    } catch (e) {
      this.logger.error(`Scanner job error:`)
      this.logger.error(e)
      this.prisma.failLogs.create({
        data: {
          txhash: transactionHash,
          userAddress: sender,
          action,
        },
      })
    }
  }
}
