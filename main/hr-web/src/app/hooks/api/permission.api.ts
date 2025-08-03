import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { PermissionType } from '@/app/types/permission.type'

export const permissionClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.PERMISSION.INDEX,
         params
      )
   },
   findOne: (id: string) => {
      return HttpClient.get<PermissionType>(
         `${API_ROUTES.PERMISSION.INDEX}/${id}`
      )
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<PermissionType>(
         API_ROUTES.PERMISSION.INDEX,
         payload
      )
   },
   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<PermissionType>(
         `${API_ROUTES.PERMISSION.INDEX}/${payload?.id}`,
         payload
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.PERMISSION.INDEX}/${id}`)
   }
}
