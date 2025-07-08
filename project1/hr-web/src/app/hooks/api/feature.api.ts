import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { FeatureType } from '@/app/types/feature.type'

export const featureClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.FEATURE.INDEX,
         params
      )
   },

   findOne: (id: string) => {
      return HttpClient.get<FeatureType>(`${API_ROUTES.FEATURE.INDEX}/${id}`)
   },

   create: (payload?: Record<string, any>) => {
      return HttpClient.post<FeatureType>(API_ROUTES.FEATURE.INDEX, payload)
   },

   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<FeatureType>(
         `${API_ROUTES.FEATURE.INDEX}/${payload?.id}`,
         {
            ...payload,
            id: undefined
         }
      )
   },
   
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.FEATURE.INDEX}/${id}`)
   }
}
