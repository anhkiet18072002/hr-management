import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types'
import { useMutation, useQuery } from 'react-query'
import { objectiveClient } from './objective.api'
import { ObjectiveType } from '@/app/types/objective.type'

const useAddObjective = () => {
   return useMutation(objectiveClient.create)
}

const useEditObjective = () => {
   return useMutation(objectiveClient.update)
}

const useGetObjectives = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.OBJECTIVE.INDEX, query],
      () => objectiveClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}
const useGetObjective = (id: string) => {
   return useQuery<ObjectiveType>(
      [`${API_ROUTES.OBJECTIVE.INDEX}/${id}`],
      () => objectiveClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteObjective = () => {
   return useMutation(objectiveClient.delete)
}

export {
   useAddObjective,
   useEditObjective,
   useGetObjective,
   useGetObjectives,
   useDeleteObjective
}
