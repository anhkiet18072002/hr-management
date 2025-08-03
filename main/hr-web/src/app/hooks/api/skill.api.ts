import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType, SkillType } from '@/app/types'

export const skillClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(API_ROUTES.SKILL.INDEX, params)
   },
   findOne: (id: string) => {
      return HttpClient.get<SkillType>(`${API_ROUTES.SKILL.INDEX}/${id}`)
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<SkillType>(API_ROUTES.SKILL.INDEX, payload)
   },
   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<SkillType>(
         `${API_ROUTES.SKILL.INDEX}/${payload?.id}`,
         payload
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.SKILL.INDEX}/${id}`)
   }
}
