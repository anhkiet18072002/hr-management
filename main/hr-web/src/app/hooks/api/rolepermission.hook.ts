import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { useMutation, useQuery } from 'react-query'
import { rolePermissionClient } from './rolepermission.api'
import { RolePermissionType } from '@/app/types/rolepermission.type'

const useGetRolePermissions = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.ROLE_PERMISSION.INDEX, query],
      () => rolePermissionClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useAddRolePermission = () => {
   return useMutation(rolePermissionClient.create)
}

const useEditRolePermission = () => {
   return useMutation(rolePermissionClient.update)
}

const useGetRolePermission = (id: string) => {
   return useQuery<RolePermissionType>(
      [`${API_ROUTES.ROLE_PERMISSION.INDEX}/${id}`],
      () => rolePermissionClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteRolePermission = () => {
   return useMutation(rolePermissionClient.delete)
}
const useUpdateRolePermission = () => {
   return useMutation(rolePermissionClient.update)
}

export {
   useGetRolePermissions,
   useAddRolePermission,
   useEditRolePermission,
   useGetRolePermission,
   useDeleteRolePermission,
   useUpdateRolePermission
}
