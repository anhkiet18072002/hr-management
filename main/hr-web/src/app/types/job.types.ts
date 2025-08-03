import { BaseEntityType } from './common.type'
import { StaffType } from './staff.type'

export type JobPositionType = BaseEntityType & {
   name: string
   shortName?: string
   description?: string
   specification?: string
   staff?: StaffType
}

export type JobLevelType = BaseEntityType & {
   name: string
   description?: string
}
