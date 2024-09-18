import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'

export class PaginationDto {
  @ApiProperty({ default: 1, required: false })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page = 1

  @ApiProperty({ default: 20, required: false })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  perPage = 20

  get skip() {
    return (this.page - 1) * this.perPage
  }
}
