import { BaseEntityType } from './common.type'

export type DataDashboard_Project_Type = BaseEntityType & {
   projectName: string[]
   staffCount: number[]
   unAssignment: number
}
export type DataDashboard_SkillLevel_Type = BaseEntityType & {
   skillName: string[]
   averageLevel: number[]
}
