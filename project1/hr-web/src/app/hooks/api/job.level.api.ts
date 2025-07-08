import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { JobLevelType } from '@/app/types/job.types'

export const jobLevelClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.JOB_LEVEL.INDEX,
         params
      )
   },
   findOne: (id: string) => {
      return HttpClient.get<JobLevelType>(`${API_ROUTES.JOB_LEVEL.INDEX}/${id}`)
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<JobLevelType>(API_ROUTES.JOB_LEVEL.INDEX, payload)
   },
   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<JobLevelType>(
         `${API_ROUTES.JOB_LEVEL.INDEX}/${payload?.id}`,
         payload
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.JOB_LEVEL.INDEX}/${id}`)
   }
}
