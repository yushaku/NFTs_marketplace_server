import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async userInfo(wallet_address: string) {
    const user = await this.prisma.user.findUnique({
      where: { wallet_address },
    })

    return user
  }
}
