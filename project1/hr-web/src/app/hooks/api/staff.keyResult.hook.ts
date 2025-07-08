import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { useMutation, useQuery } from 'react-query'
import { staffKeyResultClient } from './staff.keyResult.api'
import { StaffKeyResultType } from '@/app/types/objective.type'

const useAddStaffKeyResult = () => {
   return useMutation(staffKeyResultClient.create)
}

const useEditStaffKeyResult = () => {
   return useMutation(staffKeyResultClient.update)
}

const useGetStaffKeyResults = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.STAFF_KEY_RESULT.INDEX, query],
      () => staffKeyResultClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}
const useGetStaffKeyResult = (id: string) => {
   return useQuery<StaffKeyResultType>(
      [`${API_ROUTES.STAFF_KEY_RESULT.INDEX}/${id}`],
      () => staffKeyResultClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteStaffKeyResult = () => {
   return useMutation(staffKeyResultClient.delete)
}

export {
   useAddStaffKeyResult,
   useDeleteStaffKeyResult,
   useGetStaffKeyResult,
   useGetStaffKeyResults,
   useEditStaffKeyResult
}
