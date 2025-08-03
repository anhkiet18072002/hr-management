import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { LeaveAssignmentType } from '@/app/types/leave.assignment.type'

export const leaveAssignmentClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.LEAVE_ASSIGNMENT.INDEX,
         params
      )
   },
   findOne: (id: string) => {
      return HttpClient.get<LeaveAssignmentType>(
         `${API_ROUTES.LEAVE_ASSIGNMENT.INDEX}/${id}`
      )
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<LeaveAssignmentType>(
         API_ROUTES.LEAVE_ASSIGNMENT.INDEX,
         payload
      )
   },
   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<LeaveAssignmentType>(
         `${API_ROUTES.LEAVE_ASSIGNMENT.INDEX}/${payload?.id}`,
         {
            ...payload,
            id: undefined
         }
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.LEAVE_ASSIGNMENT.INDEX}/${id}`)
   }
}
