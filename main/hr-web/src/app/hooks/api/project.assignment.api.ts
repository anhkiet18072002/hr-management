import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { ProjectAssignmentType } from '@/app/types/project.assignment.type'

export const ProjectAssignmentClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.PROJECT_ASSIGNMENT.INDEX,
         params
      )
   },
   findOne: (id: string) => {
      return HttpClient.get<ProjectAssignmentType>(
         `${API_ROUTES.PROJECT_ASSIGNMENT.INDEX}/${id}`
      )
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<ProjectAssignmentType>(
         API_ROUTES.PROJECT_ASSIGNMENT.INDEX,
         payload
      )
   },
   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<ProjectAssignmentType>(
         `${API_ROUTES.PROJECT_ASSIGNMENT.INDEX}/${payload?.id}`,
         {
            roleId: payload.roleId,
            projectId: payload.projectId,
            staffId: payload.staffId,
            startDate: payload.startDate,
            endDate: payload.endDate
         }
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.PROJECT_ASSIGNMENT.INDEX}/${id}`)
   }
}
