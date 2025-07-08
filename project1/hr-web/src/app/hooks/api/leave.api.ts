import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { LeaveType } from '@/app/types/leave.type'

export const leaveTypeClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.LEAVE_TYPE.INDEX,
         params
      )
   },
   findOne: (id: string) => {
      return HttpClient.get<LeaveType>(`${API_ROUTES.LEAVE_TYPE.INDEX}/${id}`)
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<LeaveType>(API_ROUTES.LEAVE_TYPE.INDEX, payload)
   },
   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<LeaveType>(
         `${API_ROUTES.LEAVE_TYPE.INDEX}/${payload?.id}`,
         payload
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.LEAVE_TYPE.INDEX}/${id}`)
   }
}
