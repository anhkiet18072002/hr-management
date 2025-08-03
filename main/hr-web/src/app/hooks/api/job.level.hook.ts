import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { useMutation, useQuery } from 'react-query'
import { JobLevelType } from '@/app/types/job.types'
import { jobLevelClient } from '@/app/hooks/api/job.level.api'

const useAddJobLevel = () => {
   return useMutation(jobLevelClient.create)
}

const useEditJobLevel = () => {
   return useMutation(jobLevelClient.update)
}

const useGetJobLevels = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.JOB_LEVEL.INDEX, query],
      () => jobLevelClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useGetJobLevel = (id: string) => {
   return useQuery<JobLevelType>(
      [`${API_ROUTES.JOB_LEVEL.INDEX}/${id}`],
      () => jobLevelClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteJobLevel = () => {
   return useMutation(jobLevelClient.delete)
}

export {
   useAddJobLevel,
   useEditJobLevel,
   useGetJobLevel,
   useGetJobLevels,
   useDeleteJobLevel
}
