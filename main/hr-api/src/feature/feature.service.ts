import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { baseSelect, BaseService } from 'src/core/base.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateFeatureDto } from './dto/create-feature.dto'
import { UpdateBaseDto } from 'src/core/dto/update-base.dto'
import { UpdateFeatureDto } from './dto/update-feature.dto'
import { dot } from 'node:test/reporters'

@Injectable()
export class FeatureService extends BaseService {
   readonly defaultSelect: Prisma.FeatureSelect = {
      ...baseSelect,
      name: true,
      description: true,
      roleFeaturePermissions: {
         select: {
            role: {
               select: {
                  id: true,
                  name: true,
                  description: true,
                  key: true
               }
            },
            permission: {
               select: {
                  id: true,
                  key: true
               }
            }
         }
      }
   }

   readonly defaultSearchFields?: string[] = [
      'name',
      'description'
      // 'role.name',
      // 'role.key',
      // 'role.description',
      // 'permission.key'
   ]

   constructor(readonly prisma: PrismaService) {
      super(prisma.feature)
   }

   override async create(dto: CreateFeatureDto): Promise<any> {
      const expandedAssignments = []

      if (dto.roleFeaturePermissions && dto.roleFeaturePermissions.length > 0) {
         for (const pa of dto.roleFeaturePermissions || []) {
            const role = await this.prisma.role.findUnique({
               where: { id: pa.roleId }
            })
            if (!role) {
               throw new BadRequestException(
                  `The role with id: ${pa.roleId} does not exist or has been removed`
               )
            }
            const permissionIds = Array.isArray(pa.permissionId)
               ? pa.permissionId
               : [pa.permissionId]
            for (const permissionId of permissionIds) {
               const permission = await this.prisma.permission.findUnique({
                  where: { id: permissionId }
               })
               if (!permission) {
                  throw new BadRequestException(
                     `The permission with id: ${permissionId} does not exist or has been removed`
                  )
               }
               expandedAssignments.push({
                  roleId: pa.roleId,
                  permissionId: permissionId
               })
            }
         }
      }

      const feature = await this.prisma.feature.create({
         data: {
            name: dto.name,
            description: dto.description,
            ...(expandedAssignments.length > 0 && {
               roleFeaturePermissions: {
                  createMany: {
                     data: expandedAssignments
                  }
               }
            })
         },
         select: this.defaultSelect
      })
      return feature
   }

   override async update(id: string, dto: UpdateFeatureDto): Promise<any> {
      const feature = await this.prisma.feature.findUnique({ where: { id } })
      if (!feature) {
         throw new BadRequestException(
            `The feature with id: ${id} does not exit or has been removed`
         )
      }

      const expandedAssignments = []

      if (dto.roleFeaturePermissions && dto.roleFeaturePermissions.length > 0) {
         for (const pa of dto.roleFeaturePermissions || []) {
            const role = await this.prisma.role.findUnique({
               where: { id: pa.roleId }
            })
            if (!role) {
               throw new BadRequestException(
                  `The role with id: ${pa.roleId} does not exist or has been removed`
               )
            }
            const permissionIds = Array.isArray(pa.permissionId)
               ? pa.permissionId
               : [pa.permissionId]
            for (const permissionId of permissionIds) {
               const permission = await this.prisma.permission.findUnique({
                  where: { id: permissionId }
               })
               if (!permission) {
                  throw new BadRequestException(
                     `The permission with id: ${permissionId} does not exist or has been removed`
                  )
               }
               expandedAssignments.push({
                  roleId: pa.roleId,
                  permissionId: permissionId
               })
            }
         }
      }

      if (!dto.roleFeaturePermissions) {
         await this.prisma.roleFeaturePermission.deleteMany({
            where: { featureId: id }
         })
      }

      const update_feature = await this.prisma.feature.update({
         where: { id },
         data: {
            name: dto.name,
            description: dto.description,
            ...(expandedAssignments.length > 0 && {
               roleFeaturePermissions: {
                  deleteMany: {},
                  createMany: {
                     data: expandedAssignments
                  }
               }
            })
         }
      })

      return update_feature
   }
}
