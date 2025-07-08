import { ApiProperty } from '@nestjs/swagger'
import { RoleFeaturePermission } from '@prisma/client'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'
import { CreateBaseDto } from 'src/core/dto/create-base.dto'

export class CreateFeatureDto extends CreateBaseDto {
   @ApiProperty({ description: 'Name of the feature', required: true })
   @IsString()
   @IsNotEmpty()
   name: string

   @ApiProperty({
      description: 'Description for the feature',
      required: false
   })
   @IsOptional()
   @IsString()
   description?: string

   @ApiProperty({
      description: 'Set role and permission for feature',
      required: false
   })
   @IsOptional()
   roleFeaturePermissions?: RoleFeaturePermission[]
}
