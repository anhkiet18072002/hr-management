import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { useMutation, useQuery } from 'react-query'
import { featureClient } from './feature.api'
import { FeatureType } from '@/app/types/feature.type'

const useAddFeature = () => {
   return useMutation(featureClient.create)
}

const useEditFeature = () => {
   return useMutation(featureClient.update)
}

const useGetFeatures = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.FEATURE.INDEX, query],
      () => featureClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}
const useGetFeature = (id: string) => {
   return useQuery<FeatureType>(
      [`${API_ROUTES.FEATURE.INDEX}/${id}`],
      () => featureClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteFeature = () => {
   return useMutation(featureClient.delete)
}

export {
   useAddFeature,
   useEditFeature,
   useGetFeatures,
   useGetFeature,
   useDeleteFeature
}
