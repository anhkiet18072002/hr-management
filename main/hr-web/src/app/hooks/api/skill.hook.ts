import { API_ROUTES } from '@/app/configs/route.config'
import { skillClient } from '@/app/hooks/api/skill.api'
import { BaseApiQueryType, BaseApiResponseType, SkillType } from '@/app/types'
import { useMutation, useQuery } from 'react-query'

const useAddSkill = () => {
   return useMutation(skillClient.create)
}

const useEditSkill = () => {
   return useMutation(skillClient.update)
}

const useGetSkills = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.SKILL.INDEX, query],
      () => skillClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}
const useGetSkill = (id: string) => {
   return useQuery<SkillType>(
      [`${API_ROUTES.SKILL.INDEX}/${id}`],
      () => skillClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteSkill = () => {
   return useMutation(skillClient.delete)
}

export { useAddSkill, useEditSkill, useGetSkill, useGetSkills, useDeleteSkill }
