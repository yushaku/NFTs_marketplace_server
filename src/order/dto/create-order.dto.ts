import { ApiProperty } from '@nestjs/swagger'
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

class ProductDto {
  @IsString()
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
  address_id: number
}
