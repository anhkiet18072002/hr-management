import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { useMutation, useQuery } from 'react-query'
import { accountRoleTypeClient } from './account.role.api'
import { AccountRoleType } from '@/app/types/account-role'

const useAddAccountRole = () => {
   return useMutation(accountRoleTypeClient.create)
}

const useEditAccountRole = () => {
   return useMutation(accountRoleTypeClient.update)
}

const useGetAccountRoles = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.ACCOUNT_ROLE.INDEX, query],
      () => accountRoleTypeClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}
const useGetAccountRole = (id: string) => {
   return useQuery<AccountRoleType>(
      [`${API_ROUTES.ACCOUNT_ROLE.INDEX}/${id}`],
      () => accountRoleTypeClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteAccountRole = () => {
   return useMutation(accountRoleTypeClient.delete)
}

export {useAddAccountRole, useEditAccountRole, useGetAccountRoles, useGetAccountRole, useDeleteAccountRole } 
