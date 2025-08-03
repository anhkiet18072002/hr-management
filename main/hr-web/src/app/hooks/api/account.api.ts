import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { AccountType, BaseApiQueryType, BaseApiResponseType } from '@/app/types'

export const accountClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.ACCOUNT.INDEX,
         params
      )
   },
   findOne: (id: string) => {
      return HttpClient.get<AccountType>(`${API_ROUTES.ACCOUNT.INDEX}/${id}`)
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<AccountType>(API_ROUTES.ACCOUNT.INDEX, payload)
   },
   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<AccountType>(
         `${API_ROUTES.ACCOUNT.INDEX}/${payload?.id}`,
         payload
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.ACCOUNT.INDEX}/${id}`)
   }
}
