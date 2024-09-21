import { IsEthAddress } from '@/shared/validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UserDto {
  @ApiProperty({ example: '0x4aBfCf64bB323CC8B65e2E69F2221B14943C6EE1' })
  @IsEthAddress()
  address: string

  @ApiProperty({})
  @IsString()
  signedMessage: string
}
