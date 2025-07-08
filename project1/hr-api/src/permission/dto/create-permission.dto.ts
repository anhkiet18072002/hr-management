import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { ActionEnum } from 'src/core/enum'

export class CreatePermissionDto {
   @ApiProperty({ description: 'Entity of the permission', required: true })
   @IsString()
   @IsNotEmpty()
   entity: string

   @ApiProperty({
      description: 'Action of the permission. Eg: create, read, update, delete',
      required: true,
      examples: ['create', 'read', 'update', 'delete', 'manage']
   })
   @IsEnum(ActionEnum)
   @IsNotEmpty()
   action: string
}
