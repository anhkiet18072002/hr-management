import { API_ROUTES } from '@/app/configs/route.config'
import { staffClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { StaffType } from '@/app/types/staff.type'
import { useMutation, useQuery } from 'react-query'

const useGetStaffs = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.STAFF.INDEX, query],
      () => staffClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useAddStaff = () => {
   return useMutation(staffClient.create)
}

const useEditStaff = () => {
   return useMutation(staffClient.update)
}

const useEditStaffKeyResults = () => {
   return useMutation(staffClient.updateKeyResult)
}

const useGetStaff = (id: string) => {
   return useQuery<StaffType>(
      [`${API_ROUTES.STAFF.INDEX}/${id}`],
      () => staffClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteStaff = () => {
   return useMutation(staffClient.delete)
}

export {
   useAddStaff,
   useGetStaff,
   useGetStaffs,
   useDeleteStaff,
   useEditStaff,
   useEditStaffKeyResults
}
