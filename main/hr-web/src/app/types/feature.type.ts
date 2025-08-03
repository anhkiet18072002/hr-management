import { BaseEntityType } from '@/app/types/common.type'
import { RolePermissionType } from './role.feature.permission.type'

export type FeatureType = BaseEntityType & {
    name: string
    description?: string

    roleFeaturePermissions?: RolePermissionType[]
   
}