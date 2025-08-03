import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { useMutation, useQuery } from 'react-query'
import { projectClient } from './project.api'
import { ProjectType } from '@/app/types/project.type'

const useGetProjects = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.PROJECT.INDEX, query],
      () => projectClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useAddProject = () => {
   return useMutation(projectClient.create)
}

const useEditProject = () => {
   return useMutation(projectClient.update)
}

const useGetProject = (id: string) => {
   return useQuery<ProjectType>(
      [`${API_ROUTES.PROJECT.INDEX}/${id}`],
      () => projectClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteProject = () => {
   return useMutation(projectClient.delete)
}

export {
   useDeleteProject,
   useGetProject,
   useEditProject,
   useAddProject,
   useGetProjects
}
