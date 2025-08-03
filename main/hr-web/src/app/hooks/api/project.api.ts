import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { ProjectType } from '@/app/types/project.type'

export const projectClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.PROJECT.INDEX,
         params
      )
   },
   findOne: (id: string) => {
      return HttpClient.get<ProjectType>(`${API_ROUTES.PROJECT.INDEX}/${id}`)
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<ProjectType>(API_ROUTES.PROJECT.INDEX, payload)
   },
   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<ProjectType>(
         `${API_ROUTES.PROJECT.INDEX}/${payload?.id}`,
         {
            ...payload,
            id: undefined
         }
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.PROJECT.INDEX}/${id}`)
   }
}
