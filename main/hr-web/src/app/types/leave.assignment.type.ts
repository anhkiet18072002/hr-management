import { BaseEntityType } from '@/app/types/common.type'
import { StaffType } from './staff.type'
import { LeaveType } from './leave.type'

export type LeaveAssignmentType = BaseEntityType & {
   duration: number
   reason?: string
   staff: StaffType
   staffId: string
   startDate: Date | string
   endDate?: Date | string
   type: LeaveType
   typeId: string
}
