import { PrismaService } from '@/prisma.service'
import { JWTService } from '@/shared/jwt.service'
import { Injectable } from '@nestjs/common'
import { UserDto } from './dto/user.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JWTService,
  ) {}

  async login({ address }: UserDto) {
    let user = await this.prisma.user.findUnique({
      where: { wallet_address: address },
    })

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          wallet_address: address,
          name: 'Anonymous',
        },
      })
    }

    const token = this.jwt.createAccessToken({ address })
    return token
  }
}
