import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { RolePermissionType } from '@/app/types/rolepermission.type'

export const rolePermissionClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.ROLE_PERMISSION.INDEX,
         params
      )
   },
   findOne: (id: string) => {
      return HttpClient.get<RolePermissionType>(
         `${API_ROUTES.ROLE_PERMISSION.INDEX}/${id}`
      )
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<RolePermissionType>(
         API_ROUTES.ROLE_PERMISSION.INDEX,
         payload
      )
   },
   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<RolePermissionType>(
         `${API_ROUTES.ROLE_PERMISSION.INDEX}/${payload?.id}`,
         {
            role: payload.role,
            roleId: payload.roleId,
            permission: payload.permission,
            permissionId: payload.permissionId
         }
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.ROLE_PERMISSION.INDEX}/${id}`)
   }
}
