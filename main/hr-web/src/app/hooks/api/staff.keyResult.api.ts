import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { StaffKeyResultType } from '@/app/types/objective.type'

export const staffKeyResultClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.STAFF_KEY_RESULT.INDEX,
         params
      )
   },
   findOne: (id: string) => {
      return HttpClient.get<StaffKeyResultType>(
         `${API_ROUTES.STAFF_KEY_RESULT.INDEX}/${id}`
      )
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<StaffKeyResultType>(
         API_ROUTES.STAFF_KEY_RESULT.INDEX,
         payload
      )
   },

   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<StaffKeyResultType>(
         `${API_ROUTES.STAFF_KEY_RESULT.INDEX}/${payload?.id}`,
         { ...payload, id: undefined }
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.STAFF_KEY_RESULT.INDEX}/${id}`)
   }
}
