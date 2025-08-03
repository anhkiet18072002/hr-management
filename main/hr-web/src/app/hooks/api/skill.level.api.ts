import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import {
   BaseApiQueryType,
   BaseApiResponseType,
   SkillLevelType
} from '@/app/types'

export const skillLevelClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.SKILL_LEVEL.INDEX,
         params
      )
   },
   findOne: (id: string) => {
      return HttpClient.get<SkillLevelType>(
         `${API_ROUTES.SKILL_LEVEL.INDEX}/${id}`
      )
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<SkillLevelType>(
         API_ROUTES.SKILL_LEVEL.INDEX,
         payload
      )
   },
   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<SkillLevelType>(
         `${API_ROUTES.SKILL_LEVEL.INDEX}/${payload?.id}`,
         payload
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.SKILL_LEVEL.INDEX}/${id}`)
   }
}
