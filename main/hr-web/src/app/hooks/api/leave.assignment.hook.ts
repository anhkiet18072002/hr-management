import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { useMutation, useQuery } from 'react-query'
import { leaveAssignmentClient } from './leave.assignment.api'
import { LeaveAssignmentType } from '@/app/types/leave.assignment.type'

const useGetLeaveAssignments = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.LEAVE_ASSIGNMENT.INDEX, query],
      () => leaveAssignmentClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useAddLeaveAssignment = () => {
   return useMutation(leaveAssignmentClient.create)
}

const useEditLeaveAssignment = () => {
   return useMutation(leaveAssignmentClient.update)
}

const useGetLeaveAssignment = (id: string) => {
   return useQuery<LeaveAssignmentType>(
      [`${API_ROUTES.LEAVE_ASSIGNMENT.INDEX}/${id}`],
      () => leaveAssignmentClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteLeaveAssignment = () => {
   return useMutation(leaveAssignmentClient.delete)
}

export {
   useAddLeaveAssignment,
   useGetLeaveAssignment,
   useGetLeaveAssignments,
   useDeleteLeaveAssignment,
   useEditLeaveAssignment
}
