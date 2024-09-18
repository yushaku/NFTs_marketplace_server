import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class UserDto {
  @ApiProperty({ default: 'levanson@gmail.com' })
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty({ default: 'ssdakhf123@-dsf=@12' })
  @IsString()
  password: string
}

export class UpdatePasswordDto {
  @IsString()
  @ApiProperty()
  oldPassword: string

  @IsString()
  @ApiProperty()
  newPassword: string
}

export class CreateUserDto extends UserDto {
  @ApiProperty({ default: 'Yushaku' })
  @IsString()
  name: string
}
