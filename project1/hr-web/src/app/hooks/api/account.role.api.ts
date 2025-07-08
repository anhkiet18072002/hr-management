import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { AccountRoleType } from '@/app/types/account-role'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'

export const accountRoleTypeClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.ACCOUNT_ROLE.INDEX,
         params
      )
   },
   findOne: (id: string) => {
      return HttpClient.get<AccountRoleType>(`${API_ROUTES.ACCOUNT_ROLE.INDEX}/${id}`)
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<AccountRoleType>(API_ROUTES.ACCOUNT_ROLE.INDEX, payload)
   },
   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<AccountRoleType>(
         `${API_ROUTES.ACCOUNT_ROLE.INDEX}/${payload?.id}`,
         payload
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.ACCOUNT_ROLE.INDEX}/${id}`)
   }
}
