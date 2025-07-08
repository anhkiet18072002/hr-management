import { API_ROUTES } from '@/app/configs/route.config'
import { AccountType, BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { useMutation, useQuery } from 'react-query'
import { accountClient } from './account.api'

const useAddAccount = () => {
   return useMutation(accountClient.create)
}

const useEditAccount = () => {
   return useMutation(accountClient.update)
}

const useGetAccounts = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.ACCOUNT.INDEX, query],
      () => accountClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}
const useGetAccount = (id: string) => {
   return useQuery<AccountType>(
      [`${API_ROUTES.ACCOUNT.INDEX}/${id}`],
      () => accountClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteAccount = () => {
   return useMutation(accountClient.delete)
}

export {
   useAddAccount,
   useEditAccount,
   useGetAccount,
   useGetAccounts,
   useDeleteAccount
}
