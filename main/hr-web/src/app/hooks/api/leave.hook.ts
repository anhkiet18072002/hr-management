import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { useMutation, useQuery } from 'react-query'
import { leaveTypeClient } from './leave.api'
import { LeaveType } from '@/app/types/leave.type'

const useGetLeaves = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.LEAVE_TYPE.INDEX, query],

      () => leaveTypeClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useAddLeave = () => {
   return useMutation(leaveTypeClient.create)
}

const useGetLeave = (id: string) => {
   return useQuery<LeaveType>(
      [`${API_ROUTES.LEAVE_TYPE.INDEX}/${id}`],
      () => leaveTypeClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

export { useAddLeave, useGetLeave, useGetLeaves }
