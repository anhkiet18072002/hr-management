import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { useMutation, useQuery } from 'react-query'
import { project_price_typeClient } from './projectprice.type.api'
import { ProjectPriceType } from '@/app/types/projectprice.type'

const useGetProjectPriceTypes = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.PROJECT_PRICE_TYPE.INDEX, query],

      () => project_price_typeClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useGetMoreProjectPriceTypes = () => {
   return useQuery<ProjectPriceType>(
      [`${API_ROUTES.PROJECT_PRICE_TYPE.INDEX}/more`],
      () => project_price_typeClient.getMore(),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useAddProjecPriceType = () => {
   return useMutation(project_price_typeClient.create)
}

const useGetProjectPriceType = (id: string) => {
   return useQuery<ProjectPriceType>(
      [`${API_ROUTES.PROJECT_PRICE_TYPE.INDEX}/${id}`],
      () => project_price_typeClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

export {
   useGetProjectPriceTypes,
   useGetMoreProjectPriceTypes,
   useAddProjecPriceType,
   useGetProjectPriceType
}
