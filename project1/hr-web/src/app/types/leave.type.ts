import { BaseEntityType } from '@/app/types/common.type'

export type LeaveType = BaseEntityType & {
   name: string
   description?: string
}
