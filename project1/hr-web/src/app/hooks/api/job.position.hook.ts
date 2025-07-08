import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { useMutation, useQuery } from 'react-query'
import { jobPositionClient } from './job.position.api'
import { JobPositionType } from '@/app/types/job.types'

const useAddJobPosition = () => {
   return useMutation(jobPositionClient.create)
}

const useEditJobPosition = () => {
   return useMutation(jobPositionClient.update)
}

const useGetJobPositions = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.JOB_POSITION.INDEX, query],
      () => jobPositionClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useGetJobPosition = (id: string) => {
   return useQuery<JobPositionType>(
      [`${API_ROUTES.JOB_POSITION.INDEX}/${id}`],
      () => jobPositionClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteJobPosition = () => {
   return useMutation(jobPositionClient.delete)
}

export {
   useAddJobPosition,
   useEditJobPosition,
   useGetJobPosition,
   useGetJobPositions,
   useDeleteJobPosition
}
