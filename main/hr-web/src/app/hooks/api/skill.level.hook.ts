import { API_ROUTES } from '@/app/configs/route.config'
import { skillLevelClient } from '@/app/hooks/api/skill.level.api'
import {
   BaseApiQueryType,
   BaseApiResponseType,
   SkillLevelType
} from '@/app/types'
import { useMutation, useQuery } from 'react-query'

const useGetSkillLevels = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.SKILL_LEVEL.INDEX, query],
      () => skillLevelClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useAddSkillLevel = () => {
   return useMutation(skillLevelClient.create)
}

const useEditSkillLevel = () => {
   return useMutation(skillLevelClient.update)
}

const useGetSkillLevel = (id: string) => {
   return useQuery<SkillLevelType>(
      [`${API_ROUTES.SKILL_LEVEL.INDEX}/${id}`],
      () => skillLevelClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteSkillLevel = () => {
   return useMutation(skillLevelClient.delete)
}

export {
   useAddSkillLevel,
   useDeleteSkillLevel,
   useEditSkillLevel,
   useGetSkillLevel,
   useGetSkillLevels
}
