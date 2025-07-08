import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { useMutation, useQuery } from 'react-query'
import { projectRoleClient } from './project.role.api'
import { ProjectRoleType } from '@/app/types/project.type'

const useGetProjectRoles = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.PROJECT_ROLE.INDEX, query],

      () => projectRoleClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useAddProjectRole = () => {
   return useMutation(projectRoleClient.create)
}

const useEditProjectRole = () => {
   return useMutation(projectRoleClient.update)
}

const useDeleteProjectRole = () => {
   return useMutation(projectRoleClient.delete)
}

const useGetProjectRole = (id: string) => {
   return useQuery<ProjectRoleType>(
      [`${API_ROUTES.PROJECT_ROLE.INDEX}/${id}`],
      () => projectRoleClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

export {
   useGetProjectRole,
   useAddProjectRole,
   useEditProjectRole,
   useDeleteProjectRole,
   useGetProjectRoles
}
