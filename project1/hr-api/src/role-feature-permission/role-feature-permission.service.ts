import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma, RoleFeaturePermission } from '@prisma/client'
import { baseSelect, BaseService } from 'src/core/base.service'
import { CreateBaseDto } from 'src/core/dto/create-base.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateRoleFeaturePermissionDto } from 'src/role-feature-permission/dto/create-role-feature-permission.dto'

@Injectable()
export class RoleFeaturePermissionService extends BaseService {
   readonly defaultSelect: Prisma.RoleFeaturePermissionSelect = {
      ...baseSelect,
      feature: true,
      permission: true,
      role: true
   }

   readonly defaultSearchFields?: string[] = [
      'feature.name',
      'feature.description',
      'permission.key',
      'role.key',
      'role.name',
      'role.description'
   ]

   constructor(readonly prisma: PrismaService) {
      super(prisma.roleFeaturePermission)
   }

   override async create(
      dto: CreateRoleFeaturePermissionDto
   ): Promise<RoleFeaturePermission> {
      // Validate input data
      const role = await this.prisma.role.findUnique({
         where: {
            id: dto.roleId
         }
      })
      if (!role) {
         throw new BadRequestException(
            `The role with ID: ${dto.roleId} does not exist or has been removed`
         )
      }

      const feature = await this.prisma.feature.findUnique({
         where: {
            id: dto.featureId
         }
      })
      if (!feature) {
         throw new BadRequestException(
            `The feature with ID: ${dto.featureId} does not exist or has been removed`
         )
      }

      const permission = await this.prisma.permission.findUnique({
         where: {
            id: dto.permissionId
         }
      })
      if (!permission) {
         throw new BadRequestException(
            `The permission with ID: ${dto.permissionId} does not exist or has been removed`
         )
      }

      return super.create(dto)
   }
}
