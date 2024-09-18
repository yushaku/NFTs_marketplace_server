import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LoginDTO {
  @ApiProperty({ required: true })
  @IsString()
  email: string

  @ApiProperty({ required: true })
  @IsString()
  password: string
}

export class RegisterDTO extends LoginDTO {
  @ApiProperty({ required: true })
  @IsString()
  inviteCode: string
}
