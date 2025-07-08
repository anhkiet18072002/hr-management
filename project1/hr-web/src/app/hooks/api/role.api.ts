import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { RoleType } from '@/app/types/role.type'

export const roleClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(API_ROUTES.ROLE.INDEX, params)
   },
   findOne: (id: string) => {
      return HttpClient.get<RoleType>(`${API_ROUTES.ROLE.INDEX}/${id}`)
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<RoleType>(API_ROUTES.ROLE.INDEX, payload)
   },
   update: (payload: { id: string } & Record<string, any>) => {
      console.log(payload)
      return HttpClient.patch<RoleType>(
         `${API_ROUTES.ROLE.INDEX}/${payload?.id}`,
         {...payload, id: undefined}
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.ROLE.INDEX}/${id}`)
   }
}
