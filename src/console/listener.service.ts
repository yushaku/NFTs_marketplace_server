import { ERC_20_ABI } from '@/abi/ERC20'
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
    this.info = RPC['56']
    this.provider = new JsonRpcProvider(this.info.rpcUrls, {
      name: this.info.name,
      chainId: this.info.chainId,
    })
    this.isDevMode = this.config.get('NODE_ENV') === 'development'
  }

  async run(): Promise<void> {
    const contract = new Contract(
      '0x55d398326f99059fF775485246999027B3197955',
      ERC_20_ABI,
      this.provider,
    )

    contract.on('Transfer', async (from, to, value, event: EventLog) => {
      await this.queue.add(
        JOB_LIST.ORDER_PAID,
        {
          from,
          to,
          value: value.toString(),
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
