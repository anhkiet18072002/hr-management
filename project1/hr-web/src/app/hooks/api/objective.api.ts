import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { ObjectiveType } from '@/app/types/objective.type'

export const objectiveClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.OBJECTIVE.INDEX,
         params
      )
   },
   findOne: (id: string) => {
      return HttpClient.get<ObjectiveType>(
         `${API_ROUTES.OBJECTIVE.INDEX}/${id}`
      )
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<ObjectiveType>(API_ROUTES.OBJECTIVE.INDEX, payload)
   },

   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<ObjectiveType>(
         `${API_ROUTES.OBJECTIVE.INDEX}/${payload?.id}`,
         { ...payload, id: undefined }
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.OBJECTIVE.INDEX}/${id}`)
   }
}
