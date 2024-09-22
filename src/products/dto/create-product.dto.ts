import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsUrl,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator'

export class CreateProductDto {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name: string

  @IsString()
  @IsOptional()
  @ApiProperty({})
  description?: string

  @IsNumber()
  @Min(0, { message: 'Price must be a positive number' })
  @ApiProperty({})
  price: number

  @IsNumber()
  @Min(0, { message: 'Stock quantity must be a positive number' })
  @ApiProperty({})
  stock_quantity: number

  @IsUrl({}, { message: 'Banner must be a valid URL' })
  @IsNotEmpty({ message: 'Banner URL is required' })
  @ApiProperty({})
  banner: string

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one image URL is required' })
  @IsUrl({}, { each: true, message: 'Each image URL must be a valid URL' })
  @ApiProperty({})
  image_urls: string[]
}
