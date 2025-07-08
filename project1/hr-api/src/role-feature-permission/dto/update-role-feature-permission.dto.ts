import { PartialType } from '@nestjs/swagger'
import { CreateRoleFeaturePermissionDto } from './create-role-feature-permission.dto'

export class UpdateRoleFeaturePermissionDto extends PartialType(
   CreateRoleFeaturePermissionDto
) {}
