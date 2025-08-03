import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { useMutation, useQuery } from 'react-query'
import { keyResultClient } from './keyResult.api'
import { keyResultType } from '@/app/types/objective.type'

const useAddKeyResult = () => {
   return useMutation(keyResultClient.create)
}

const useEditKeyResult = () => {
   return useMutation(keyResultClient.update)
}

const useGetKeyResults = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.KEY_RESULT.INDEX, query],
      () => keyResultClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}
const useGetKeyResult = (id: string) => {
   return useQuery<keyResultType>(
      [`${API_ROUTES.KEY_RESULT.INDEX}/${id}`],
      () => keyResultClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteKeyResult = () => {
   return useMutation(keyResultClient.delete)
}

export {
   useDeleteKeyResult,
   useGetKeyResult,
   useGetKeyResults,
   useEditKeyResult,
   useAddKeyResult
}
