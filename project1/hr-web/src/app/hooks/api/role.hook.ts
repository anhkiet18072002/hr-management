import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { useMutation, useQuery } from 'react-query'
import { roleClient } from './role.api'
import { RoleType } from '@/app/types/role.type'

const useAddRole = () => {
   return useMutation(roleClient.create)
}

const useEditRole = () => {
   return useMutation(roleClient.update)
}

const useGetRoles = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.ROLE.INDEX, query],
      () => roleClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}
const useGetRole = (id: string) => {
   return useQuery<RoleType>(
      [`${API_ROUTES.ROLE.INDEX}/${id}`],
      () => roleClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteRole = () => {
   return useMutation(roleClient.delete)
}

export { useAddRole, useEditRole, useGetRoles, useGetRole, useDeleteRole }
