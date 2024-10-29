import { IsEthAddress } from '@/shared/validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator'

class ProductDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Product ID is required' })
  @ApiProperty({
    example: '12345',
    description: 'The unique ID of the product',
  })
  product_id: number

  @IsNumber()
  @IsPositive({ message: 'Quantity must be a positive number' })
  @ApiProperty({
    example: 1,
    description: 'The quantity of the product ordered',
    minimum: 1,
  })
  quantity: number
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one product is required' })
  @ValidateNested({ each: true })
  @Type(() => ProductDto) // Helps NestJS apply the validation to the nested objects
  @ApiProperty({
    type: [ProductDto],
    description: 'An array of products in the order',
  })
  products: ProductDto[]

  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'ID of address of user',
  })
  address_id: number

  @IsEthAddress()
  @ApiProperty()
  token_address: string
}

export class DeleteOrderDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one uuid is required' })
  @IsUUID('4', { each: true })
  @ApiProperty({
    description: 'ID of order of user',
  })
  order_ids: string[]
}
