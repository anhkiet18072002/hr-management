import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { keyResultType, StaffKeyResultType } from '@/app/types/objective.type'

export const keyResultClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.KEY_RESULT.INDEX,
         params
      )
   },
   findOne: (id: string) => {
      return HttpClient.get<keyResultType>(
         `${API_ROUTES.KEY_RESULT.INDEX}/${id}`
      )
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<StaffKeyResultType>(
         API_ROUTES.KEY_RESULT.INDEX,
         payload
      )
   },

   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<keyResultType>(
         `${API_ROUTES.KEY_RESULT.INDEX}/${payload?.id}`,
         { ...payload, id: undefined }
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.KEY_RESULT.INDEX}/${id}`)
   }
}
