import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { RoleFeaturePermissionType } from '@/app/types/role.feature.permission.type'

export const roleFeaturePermissionClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.ROLE_FEATURE_PERMISSION.INDEX,
         params
      )
   },
   findOne: (id: string) => {
      return HttpClient.get<RoleFeaturePermissionType>(
         `${API_ROUTES.ROLE_FEATURE_PERMISSION.INDEX}/${id}`
      )
   },
   create: (payload: Record<string, any>) => {
      return HttpClient.post<RoleFeaturePermissionType>(
         API_ROUTES.ROLE_FEATURE_PERMISSION.INDEX, {
            featureId: payload.featureId,
            roleId: payload.roleId,
            permissionId: payload.permissionId
         }
      )
   },

   update: (payload: { id: string } & Record<string, any>) => {
      console.log('payload', payload)
      return HttpClient.patch<RoleFeaturePermissionType>(
         `${API_ROUTES.ROLE_FEATURE_PERMISSION.INDEX}/${payload?.id}`,
         payload
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.ROLE_FEATURE_PERMISSION.INDEX}/${id}`)
   }
}
