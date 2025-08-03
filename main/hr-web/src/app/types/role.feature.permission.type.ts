import { BaseEntityType } from './common.type'
import { FeatureType } from './feature.type'
import { PermissionType } from './permission.type'
import { RoleType } from './role.type'

export type RoleFeaturePermissionType = BaseEntityType & {

   roleId: string
   featureId: string
   permissionId: string

   role: RoleType
   feature: FeatureType
   permission: PermissionType
}
export type RolePermissionType = {
   roleId: string
   permissionId?: string[]

   role?: RoleType
   permission?: PermissionType
}
