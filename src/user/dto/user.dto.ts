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

export class CreateAddressDto {
  @ApiProperty({ required: true })
  @IsString()
  recipient_name: string

  @ApiProperty({ required: true })
  @IsString()
  street: string

  @ApiProperty({ required: true })
  @IsString()
  city: string

  @ApiProperty({ required: true })
  @IsString()
  phone_number: string
}

export class UpdateAddressDto extends CreateAddressDto {
  @ApiProperty({ required: true })
  @IsString()
  address_id: number
}
