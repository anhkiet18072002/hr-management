import { AccountType } from '@/app/types/account.type'
import { AvatarType } from '@/app/types/avatar.type'
import { BaseEntityType } from '@/app/types/common.type'
import { JobLevelType, JobPositionType } from '@/app/types/job.types'
import { SkillAssignmentType } from './skill.assignment.type'
import { ObjectiveType, StaffKeyResultType } from './objective.type'

export type StaffType = BaseEntityType & {
   account: AccountType
   avatar?: AvatarType
   startDate?: Date | string
   endDate?: Date | string
   firstName: string
   lastName: string
   middleName: string
   jobPosition?: JobPositionType
   jobLevel?: JobLevelType
   objectives?: ObjectiveType[]
   staffKeyResults?: StaffKeyResultType[]
   skillAssignments: SkillAssignmentType[]
}
