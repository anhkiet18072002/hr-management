import { BaseEntityType } from '@/app/types/common.type'
import { PermissionType } from './permission.type'
import { RoleType } from './role.type'

export type RolePermissionType = BaseEntityType & {
   id: string

   roleId: string
   permissionId: string
   role: RoleType
   permission: PermissionType
}
