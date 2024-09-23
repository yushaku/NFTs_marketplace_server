import { PrismaService } from '@/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateAddressDto, UpdateAddressDto } from './dto/user.dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async userInfo(wallet_address: string) {
    const user = await this.prisma.user.findUnique({
      where: { wallet_address },
    })

    return user
  }

  async getAllAddress(user_wallet: string) {
    return this.prisma.address.findMany({
      where: { user_wallet },
    })
  }

  async addAddress(user_wallet: string, data: CreateAddressDto) {
    const count = await this.prisma.address.count({ where: { user_wallet } })

    if (count >= 4) {
      throw new BadRequestException('Maximum address reached')
    }

    const user = await this.prisma.address.create({
      data: {
        user_wallet,
        ...data,
      },
    })

    return user
  }

  async updateAddress(user_wallet: string, data: UpdateAddressDto) {
    const { address_id, ...rest } = data

    const user = await this.prisma.address.update({
      where: { user_wallet, address_id },
      data: {
        user_wallet,
        ...rest,
      },
    })

    return user
  }
}
