import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { JobPositionType } from '@/app/types/job.types'

export const jobPositionClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.JOB_POSITION.INDEX,
         params
      )
   },
   findOne: (id: string) => {
      return HttpClient.get<JobPositionType>(
         `${API_ROUTES.JOB_POSITION.INDEX}/${id}`
      )
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<JobPositionType>(
         API_ROUTES.JOB_POSITION.INDEX,
         payload
      )
   },
   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<JobPositionType>(
         `${API_ROUTES.JOB_POSITION.INDEX}/${payload?.id}`,
         payload
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.JOB_POSITION.INDEX}/${id}`)
   }
}
