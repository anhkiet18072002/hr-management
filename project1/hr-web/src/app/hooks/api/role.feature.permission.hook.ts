import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { useMutation, useQuery } from 'react-query'
import { roleFeaturePermissionClient } from './role.feature.permission.api'
import { RoleFeaturePermissionType } from '@/app/types/role.feature.permission.type'

const useGetRoleFeaturePermissions = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.ROLE_FEATURE_PERMISSION.INDEX, query],
      () => roleFeaturePermissionClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useAddRoleFeaturePermission = () => {
   return useMutation(roleFeaturePermissionClient.create)
}

const useEditRoleFeaturePermission = () => {
   return useMutation(roleFeaturePermissionClient.update)
}

const useGetRoleFeaturePermission = (id: string) => {
   return useQuery<RoleFeaturePermissionType>(
      [`${API_ROUTES.ROLE_FEATURE_PERMISSION.INDEX}/${id}`],
      () => roleFeaturePermissionClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteRoleFeaturePermission = () => {
   return useMutation(roleFeaturePermissionClient.delete)
}

export {
   useAddRoleFeaturePermission,
   useGetRoleFeaturePermission,
   useGetRoleFeaturePermissions,
   useDeleteRoleFeaturePermission,
   useEditRoleFeaturePermission
}
