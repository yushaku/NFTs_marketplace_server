import { PrismaService } from '@/prisma.service'
import { QUEUE_LIST, TOPICS } from '@/shared/constant'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { OrderStatus } from '@prisma/client'
import { Job } from 'bullmq'

type PayedOrder = [order_id: string, buyer: string, price: string]
type CanceledOrder = [order_id: string, refundAmount: string, feeAmount: string]

@Processor(QUEUE_LIST.CONTRACT)
export class ContractConsumer extends WorkerHost {
  logger = new Logger(ContractConsumer.name)

  constructor(private readonly prisma: PrismaService) {
    super()
  }

  async process(job: Job<any, any, string>) {
    try {
      switch (job.name) {
        case TOPICS.ORDER_PAID: {
          const data = job.data as PayedOrder
          console.log(data)

          const [order_id] = data

          await this.prisma.order.update({
            where: { order_id },
            data: {
              status: OrderStatus.paid,
            },
          })
          break
        }

        case TOPICS.ORDER_CANCELLED: {
          const data = job.data as CanceledOrder
          console.log(data)
          const [order_id] = data

          await this.prisma.order.update({
            where: { order_id },
            data: {
              status: OrderStatus.cancelled,
            },
          })
        }
      }
    } catch (e) {
      this.logger.error(`Scanner job error:`)
      this.logger.error(e)
    }
  }
}
