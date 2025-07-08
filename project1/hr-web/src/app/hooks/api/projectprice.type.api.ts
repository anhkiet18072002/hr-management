import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { ProjectPriceType } from '@/app/types/projectprice.type'

export const project_price_typeClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.PROJECT_PRICE_TYPE.INDEX,
         params
      )
   },
   getMore: () => {
      return HttpClient.get<ProjectPriceType>(
         `${API_ROUTES.PROJECT_PRICE_TYPE.INDEX}/more`
      )
   },
   findOne: (id: string) => {
      return HttpClient.get<ProjectPriceType>(
         `${API_ROUTES.PROJECT_PRICE_TYPE.INDEX}/${id}`
      )
   },
   create: (payload?: Record<string, any>) => {
      return HttpClient.post<ProjectPriceType>(
         API_ROUTES.PROJECT_PRICE_TYPE.INDEX,
         payload
      )
   },
   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<ProjectPriceType>(
         `${API_ROUTES.PROJECT_PRICE_TYPE.INDEX}/${payload?.id}`,
         payload
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.PROJECT_PRICE_TYPE.INDEX}/${id}`)
   }
}
