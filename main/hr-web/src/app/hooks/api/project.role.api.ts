import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { ProjectRoleType } from '@/app/types/project.type'
export const projectRoleClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.PROJECT_ROLE.INDEX,
         params
      )
   },

   findOne: (id: string) => {
      return HttpClient.get<ProjectRoleType>(
         `${API_ROUTES.PROJECT_ROLE.INDEX}/${id}`
      )
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<ProjectRoleType>(
         API_ROUTES.PROJECT_ROLE.INDEX,
         payload
      )
   },
   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<ProjectRoleType>(
         `${API_ROUTES.PROJECT_ROLE.INDEX}/${payload?.id}`,
         payload
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.PROJECT_ROLE.INDEX}/${id}`)
   }
}
