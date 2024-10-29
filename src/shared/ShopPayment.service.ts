import { SHOP_PAYMENT_ABI } from '@/abi/shopPayment'
import { Injectable } from '@nestjs/common'
import { Contract, JsonRpcProvider, parseUnits } from 'ethers'
import { RPC } from './constant'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PaymentService {
  private contract: Contract

  constructor(config: ConfigService) {
    const chainId = config.get('THE_CHAIN_ID') || 97
    const info = RPC[chainId as 97]

    const provider = new JsonRpcProvider(info.rpcUrls, {
      name: info.name,
      chainId: chainId,
    })

    this.contract = new Contract(info.shopPayment, SHOP_PAYMENT_ABI, provider)
  }

  async isPayableToken(token: string) {
    return this.contract.payableToken(token)
  }

  encodeCreateOrder(
    order_id: string,
    token_address: string,
    total_price: string,
  ) {
    return this.contract.interface.encodeFunctionData('createAndPayOrder', [
      order_id,
      parseUnits(total_price, 'ether'),
      token_address,
    ])
  }
}
