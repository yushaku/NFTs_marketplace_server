import { SHOP_PAYMENT_ABI } from '@/abi/shopPayment'
import { JOB_LIST, QUEUE_LIST, RPC } from '@/shared/constant'
import { InjectQueue } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Queue } from 'bullmq'
import { Contract, EventLog, Interface, JsonRpcProvider } from 'ethers'
import { Command, CommandRunner } from 'nest-commander'

@Command({ name: 'listener' })
export class ListenerService extends CommandRunner {
  logger = new Logger(ListenerService.name)

  paymentGatway = new Interface(SHOP_PAYMENT_ABI)
  info: (typeof RPC)['56' | '97']
  isDevMode = false
  provider: JsonRpcProvider

  constructor(
    @InjectQueue(QUEUE_LIST.CONTRACT) private queue: Queue,
    private config: ConfigService,
  ) {
    super()
    this.info = RPC[this.config.get('THE_CHAIN_ID') ?? 97]
    this.provider = new JsonRpcProvider(this.info.rpcUrls, {
      name: this.info.name,
      chainId: this.info.chainId,
    })
    this.isDevMode = this.config.get('NODE_ENV') === 'development'
  }

  async run(): Promise<void> {
    const contract = new Contract(
      this.info.shopPayment,
      SHOP_PAYMENT_ABI,
      this.provider,
    )

    contract.on('OrderCreated', async (_from, _to, _value, event: EventLog) => {
      console.log({
        orderId: event.args[0],
        buyer: event.args[1],
        price: String(event.args[2]),
      })

      await this.queue.add(
        JOB_LIST.ORDER_PAID,
        {
          topic: 'OrderCreated',
          data: {
            orderId: event.args[0],
            buyer: event.args[1],
            price: String(event.args[2]),
          },
        },
        {
          jobId: event.transactionHash,
          removeOnComplete: {
            age: 3600,
          },
        },
      )
    })
  }
}
