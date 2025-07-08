import { ApiProperty } from '@nestjs/swagger'
import { RoleFeaturePermission } from '@prisma/client'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateRoleDto {
   @ApiProperty({ description: 'Name of the role', required: true })
   @IsString()
   @IsNotEmpty()
   name: string

   @ApiProperty({ description: 'Key of the role', required: true })
   @IsString()
   @IsNotEmpty()
   key: string

   @ApiProperty({ description: 'Description of the role', required: false })
   @IsString()
   @IsOptional()
   description?: string

   @ApiProperty({
      description: 'Set permission for role',
      required: false
   })
   @IsOptional()
   roleFeaturePermissions?: RoleFeaturePermission[]
}
