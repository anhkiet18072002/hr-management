import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { useMutation, useQuery } from 'react-query'
import { project_typeClient } from './project.type.api'
import { ProjectTypeType } from '@/app/types/project.type'
const useGetProjectTypes = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.PROJECT_TYPE.INDEX, query],

      () => project_typeClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useGetMoreProjectTypes = () => {
   return useQuery<ProjectTypeType>(
      [`${API_ROUTES.PROJECT_TYPE.INDEX}/more`],
      () => project_typeClient.getMore(),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useAddProjectType = () => {
   return useMutation(project_typeClient.create)
}

const useGetProjectType = (id: string) => {
   return useQuery<ProjectTypeType>(
      [`${API_ROUTES.PROJECT_TYPE.INDEX}/${id}`],
      () => project_typeClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

export {
   useGetProjectTypes,
   useGetMoreProjectTypes,
   useAddProjectType,
   useGetProjectType
}
