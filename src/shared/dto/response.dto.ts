import { PaginationDto } from '@/shared/dto/request.dto'
import { HttpCodeMessages } from '@/shared/constant'
import { ApiProperty } from '@nestjs/swagger'

export type Resource = Record<string, any>

export class MetaDto {
  @ApiProperty({ default: 1 })
  page: number = 1

  @ApiProperty({ default: 0 })
  total: number = 0

  @ApiProperty({ default: 0 })
  totalPages: number = 0

  @ApiProperty({ default: 20 })
  perPage: number = 20

  constructor(pagination: PaginationDto, total: number) {
    this.page = pagination.page
    this.perPage = pagination.perPage
    this.total = total
    this.totalPages = Math.ceil(this.total / this.perPage)
  }
}

export class ResponseDTO<T> {
  @ApiProperty({ default: true })
  success: boolean = true

  @ApiProperty({ default: 200 })
  statusCode: number = 200

  @ApiProperty({ required: false })
  error?: string

  @ApiProperty({ required: false })
  message?: string | string[]

  @ApiProperty({ required: false })
  meta?: MetaDto

  @ApiProperty({ required: false })
  data?: T

  constructor(data: Partial<ResponseDTO<T>> = {}) {
    Object.assign(this, {
      ...data,
      message: data.message || HttpCodeMessages[this.statusCode],
    })
  }
}
