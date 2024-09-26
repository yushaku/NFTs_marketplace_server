import { CHAINLINK_PRICE_FEED_ABI } from '@/abi/chainLinkPriceFeed'
import { Injectable } from '@nestjs/common'
import { Contract, formatUnits, JsonRpcProvider } from 'ethers'
import { RPC } from './constant'

const priceFeedAddress = {
  BNB: '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE',
  ETH: '0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e',
}

@Injectable()
export class ChainLinkService {
  info = RPC['56']

  provider = new JsonRpcProvider(this.info.rpcUrls, {
    name: this.info.name,
    chainId: this.info.chainId,
  })

  async getPrice(symbol: keyof typeof priceFeedAddress) {
    const priceFeed = new Contract(
      priceFeedAddress[symbol],
      CHAINLINK_PRICE_FEED_ABI,
      this.provider,
    )

    const price = (await priceFeed.latestRoundData()) as bigint[]
    return formatUnits(price[1], 8)
  }
}
