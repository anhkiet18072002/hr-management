import { BaseEntityType } from '@/app/types/common.type'
import { ProjectPriceType } from './projectprice.type'
import { StaffType } from '@/app/types/staff.type'

export enum ProjectStatusEnum {
   ACTIVE = 'active',
   COMPLETED = 'completed',
   CANCELLED = 'cancelled',
   PENDING = 'pending'
}

export enum ProjectPriorityEnum {
   LOW = 'low',
   MEDIUM = 'medium',
   HIGH = 'high'
}

export type ProjectRoleType = BaseEntityType & {
   name: string
   description?: string
}

export type ProjectTypeType = BaseEntityType & {
   name: string
   description?: string
}

export type ProjectAssignmentType = BaseEntityType & {
   endDate?: Date | null
   startDate: Date
   project?: ProjectType
   projectId: string
   role?: ProjectRoleType
   roleId: string | string[]
   staff?: StaffType
   staffId: string
   workload: number
}

export type ProjectType = BaseEntityType & {
   description?: string
   name: string
   priceType: ProjectPriceType
   priceTypeId: string
   priority: ProjectPriorityEnum
   projectAssignments?: ProjectAssignmentType[]
   startDate?: Date | string
   endDate?: Date | string
   status: ProjectStatusEnum
   type: ProjectTypeType
   typeId: string
}
