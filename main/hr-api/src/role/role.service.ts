import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { baseSelect, BaseService } from 'src/core/base.service'
import { ROLES } from 'src/core/constant'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'

export const RoleSelect: Prisma.RoleSelect = {
   ...baseSelect,
   key: true,
   name: true,
   description: true,
   roleFeaturePermissions: {
      where: {
         feature: null
      },

      select: {
         permissionId: true
      }
   }
}

@Injectable()
export class RoleService extends BaseService {
   defaultSelect: Prisma.RoleSelect = RoleSelect
   defaultSearchFields?: Prisma.RoleScalarFieldEnum[] = [
      'name',
      'key',
      'description'
   ]

   constructor(readonly prisma: PrismaService) {
      super(prisma.role)
   }

   override async create(dto: CreateRoleDto): Promise<any> {
      if (dto.roleFeaturePermissions && dto.roleFeaturePermissions.length > 0) {
         for (const pa of dto.roleFeaturePermissions || []) {
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
            }
         }
      }

      const role = await this.prisma.role.create({
         data: {
            name: dto.name,
            key: dto.key,
            description: dto.description,
            ...(dto.roleFeaturePermissions?.length > 0 && {
               roleFeaturePermissions: {
                  createMany: {
                     data: dto.roleFeaturePermissions
                  }
               }
            })
         },
         select: this.defaultSelect
      })

      return role
   }

   override async update(id: string, dto: UpdateRoleDto): Promise<any> {
      const role = await this.prisma.role.findUnique({ where: { id } })
      if (!role) {
         throw new BadRequestException(
            `The role with id: ${id} does not exist or has been removed`
         )
      }

      let createData = [] // Dữ liệu sẽ được tạo mới
      let permissionsToDelete: string[] = [] // Dữ liệu sẽ bị xóa

      const roleFeatures = await this.prisma.roleFeaturePermission.findMany({
         where: {
            roleId: id
         },
         select: {
            featureId: true
         }
      })

      const featureIds = roleFeatures
         .map((roleFeature) => roleFeature.featureId)
         .filter((featureId) => featureId !== null) // Loại bỏ giá trị null
         .reduce(
            (unique, item) =>
               unique.includes(item) ? unique : [...unique, item],
            []
         ) // Loại bỏ trùng lặp

      if (dto.roleFeaturePermissions && dto.roleFeaturePermissions.length > 0) {
         // Kiểm tra permissionId và featureId có hợp lệ không
         for (const pa of dto.roleFeaturePermissions) {
            if (pa.featureId) {
               const feature = await this.prisma.feature.findUnique({
                  where: { id: pa.featureId }
               })
               if (!feature) {
                  throw new BadRequestException(
                     `The feature with id: ${pa.featureId} does not exist or has been removed`
                  )
               }
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
            }
         }

         // Tạo các roleFeaturePermission mới từ DTO
         for (const rfp of dto.roleFeaturePermissions) {
            // Kiểm tra xem permissionId đã tồn tại chưa
            const exists = await this.prisma.roleFeaturePermission.findFirst({
               where: {
                  roleId: id,
                  permissionId: rfp.permissionId
               }
            })

            if (!exists) {
               for (const featureId of featureIds) {
                  createData.push({
                     roleId: id,
                     permissionId: rfp.permissionId,
                     featureId: featureId
                  })
               }
               createData.push({
                  roleId: id,
                  permissionId: rfp.permissionId
               })
            }
         }

         // Lấy các permissionId hiện tại trong database để so sánh
         const currentPermissions =
            await this.prisma.roleFeaturePermission.findMany({
               where: { roleId: id },
               select: { permissionId: true }
            })

         const currentPermissionIds = currentPermissions.map(
            (p) => p.permissionId
         )

         // Tạo danh sách các permissionId mới từ DTO
         const newPermissionIds = dto.roleFeaturePermissions.flatMap((rfp) =>
            Array.isArray(rfp.permissionId)
               ? rfp.permissionId
               : [rfp.permissionId]
         )

         // Lọc các permissionId cần xóa (không có trong DTO)
         permissionsToDelete = currentPermissionIds.filter(
            (pid) => !newPermissionIds.includes(pid)
         )
      } else {
         // Nếu dto.roleFeaturePermissions rỗng, xóa tất cả các permissionId của roleId
         await this.prisma.roleFeaturePermission.deleteMany({
            where: {
               roleId: id
            }
         })
      }

      // Xóa các permissionId không có trong DTO
      if (permissionsToDelete.length > 0) {
         await this.prisma.roleFeaturePermission.deleteMany({
            where: {
               roleId: id,
               permissionId: { in: permissionsToDelete }
            }
         })
      }

      // Thực hiện tạo các roleFeaturePermission mới
      if (createData.length > 0) {
         await this.prisma.roleFeaturePermission.createMany({
            data: createData
         })
      }

      // Cập nhật thông tin role
      const update_role = await this.prisma.role.update({
         where: { id },
         data: {
            name: dto.name,
            key: dto.key,
            description: dto.description
         },
         select: this.defaultSelect
      })

      return update_role
   }

   override async remove(id: string): Promise<any> {
      const role = await this.prisma.role.findUnique({ where: { id } })
      if (!role) {
         throw new BadRequestException(`The role with ID: ${id} does not exist or has been removed`)
      }

      // Validate if role is core
      if (role.key === ROLES.CORE_ADMIN || role.key === ROLES.CORE_BASIC) {
         throw new ForbiddenException(`CORE roles can't be deleted`)
      }

      return await super.remove(id)
   }
}
