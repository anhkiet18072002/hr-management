import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { SkillAssignmentType } from '@/app/types/skill.assignment.type'

export const skillAssignmentClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.SKILL_ASSIGNMENT.INDEX,
         params
      )
   },
   findOne: (id: string) => {
      return HttpClient.get<SkillAssignmentType>(
         `${API_ROUTES.SKILL_ASSIGNMENT.INDEX}/${id}`
      )
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<SkillAssignmentType>(
         API_ROUTES.SKILL_ASSIGNMENT.INDEX,
         payload
      )
   },

   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<SkillAssignmentType>(
         `${API_ROUTES.SKILL_ASSIGNMENT.INDEX}/${payload?.id}`,
         {
            duration: payload.duration,
            skillId: payload.skillId,
            staffId: payload.staffId,
            levelId: payload.levelId,
            yearOfExp: payload.yearOfExp,
            primary: payload.primary
         }
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.SKILL_ASSIGNMENT.INDEX}/${id}`)
   }
}
