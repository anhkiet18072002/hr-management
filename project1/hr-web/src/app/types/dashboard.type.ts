import { BaseEntityType } from './common.type'
import {
   DataDashboard_Project_Type,
   DataDashboard_Skill_Type,
   DataDashboard_SkillLevel_Type
} from './data.dashboard.type'

export type Dashboard_Project_Type = BaseEntityType & {
   chartId: string
   label: string
   data: DataDashboard_Project_Type
}

export type Dashboard_Skill_Type = BaseEntityType & {
   chartId: string
   label: string
   data: DataDashboard_Skill_Type
}
export type Dashboard_SkillLevel_Type = BaseEntityType & {
   chartId: string
   label: string
   data: DataDashboard_SkillLevel_Type
}