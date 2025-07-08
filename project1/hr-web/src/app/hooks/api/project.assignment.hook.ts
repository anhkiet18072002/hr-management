import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { useMutation, useQuery } from 'react-query'
import { ProjectAssignmentClient } from './project.assignment.api'
import { ProjectAssignmentType } from '@/app/types/project.assignment.type'

const useGetProjectAssignments = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.PROJECT_ASSIGNMENT.INDEX, query],
      () => ProjectAssignmentClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useAddProjectAssignment = () => {
   return useMutation(ProjectAssignmentClient.create)
}

const useEditProjectAssignment = () => {
   return useMutation(ProjectAssignmentClient.update)
}

const useGetProjectAssignment = (id: string) => {
   return useQuery<ProjectAssignmentType>(
      [`${API_ROUTES.PROJECT_ASSIGNMENT.INDEX}/${id}`],
      () => ProjectAssignmentClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteProjectAssignment = () => {
   return useMutation(ProjectAssignmentClient.delete)
}

export {
   useGetProjectAssignment,
   useDeleteProjectAssignment,
   useEditProjectAssignment,
   useGetProjectAssignments,
   useAddProjectAssignment
}
