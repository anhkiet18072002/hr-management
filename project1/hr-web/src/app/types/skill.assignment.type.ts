import { BaseEntityType } from '@/app/types/common.type'
import { StaffType } from './staff.type'
import { SkillLevelType, SkillType } from './skill.type'

export type SkillAssignmentType = BaseEntityType & {
   skill?: SkillType
   skillId: string
   staff?: StaffType
   staffId?: string
   level?: SkillLevelType
   levelId: string
   primary?: boolean
   yearOfExp: number
}
