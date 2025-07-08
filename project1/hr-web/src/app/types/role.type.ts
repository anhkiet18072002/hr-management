import { BaseEntityType } from '@/app/types/common.type'
import { RoleFeaturePermissionType } from './role.feature.permission.type'

export type RoleType = BaseEntityType & {
   key: string
   name: string
   description?: string
   roleFeaturePermissions: RoleFeaturePermissionType[]
}
