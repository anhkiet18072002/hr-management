import { Module } from '@nestjs/common'
import { RoleFeaturePermissionService } from './role-feature-permission.service'
import { RoleFeaturePermissionController } from './role-feature-permission.controller'

@Module({
   controllers: [RoleFeaturePermissionController],
   providers: [RoleFeaturePermissionService]
})
export class RoleFeaturePermissionModule {}
