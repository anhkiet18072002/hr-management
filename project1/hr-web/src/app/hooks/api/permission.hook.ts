import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { useMutation, useQuery } from 'react-query'
import { permissionClient } from './permission.api'
import { PermissionType } from '@/app/types/permission.type'

const useAddPermission = () => {
   return useMutation(permissionClient.create)
}

const useEditPermission = () => {
   return useMutation(permissionClient.update)
}
const useGetPermissions = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.PERMISSION.INDEX, query],
      () => permissionClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}
const useGetPermission = (id: string) => {
   return useQuery<PermissionType>(
      [`${API_ROUTES.PERMISSION.INDEX}/${id}`],
      () => permissionClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeletePermission = () => {
   return useMutation(permissionClient.delete)
}

export {
   useAddPermission,
   useEditPermission,
   useGetPermissions,
   useGetPermission,
   useDeletePermission
}
