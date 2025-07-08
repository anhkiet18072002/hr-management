import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import {
   Dashboard_Project_Type,
   Dashboard_Skill_Type,
   Dashboard_SkillLevel_Type
} from '@/app/types/dashboard.type'

export const DashboardClient = {
   findOneProject: (info: string) => {
      return HttpClient.get<Dashboard_Project_Type>(
         `${API_ROUTES.DASHBOARD.INDEX}/${info}`
      )
   },
   findOneSkill: (info: string) => {
      return HttpClient.get<Dashboard_Skill_Type>(
         `${API_ROUTES.DASHBOARD.INDEX}/${info}`
      )
   },
   findOneSkillLevel: (info: string) => {
      return HttpClient.get<Dashboard_SkillLevel_Type>(
         `${API_ROUTES.DASHBOARD.INDEX}/${info}`
      )
   },
   updateOneSkillLevel: (info: string) => {
      return HttpClient.patch<Dashboard_SkillLevel_Type>(
         `${API_ROUTES.DASHBOARD.INDEX}/${info}`
      )
   },
}
