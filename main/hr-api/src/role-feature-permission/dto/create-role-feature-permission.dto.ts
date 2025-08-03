import { ApiProperty } from '@nestjs/swagger'
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateRoleFeaturePermissionDto {
   @ApiProperty({ description: 'Role ID that is assigned', required: true })
   @IsMongoId()
   @IsNotEmpty()
   roleId: string

   @ApiProperty({
      description: 'Permission ID that is assigned',
      required: true
   })
   @IsMongoId()
   @IsNotEmpty()
   permissionId: string

   @ApiProperty({ description: 'Feature ID that is assigned', required: false })
   @IsMongoId()
   @IsOptional()
   featureId?: string
}
