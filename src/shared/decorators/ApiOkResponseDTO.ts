import { ResponseDTO } from '@/shared/dto'
import { applyDecorators } from '@nestjs/common'
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger'

export const ApiOkResponseDTO = ({
  data,
  ...options
}: ApiResponseOptions & {
  data: Function | [Function]
}) => {
  const isArray = Array.isArray(data)
  const dataType = isArray ? data[0] : data
  const dataSchema = isArray
    ? {
        type: 'array',
        items: { $ref: getSchemaPath(dataType as Function) },
      }
    : {
        $ref: getSchemaPath(dataType),
      }

  return applyDecorators(
    ApiExtraModels(ResponseDTO, dataType),
    ApiOkResponse({
      ...options,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDTO) },
          {
            properties: {
              data: dataSchema,
            },
          },
        ],
      },
    }),
  )
}
