import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { useMutation, useQuery } from 'react-query'
import { skillAssignmentClient } from './skill.assignment.api'
import { SkillAssignmentType } from '@/app/types/skill.assignment.type'

const useGetSkillAssignments = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.SKILL_ASSIGNMENT.INDEX, query],
      () => skillAssignmentClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useAddSkillAssignment = () => {
   return useMutation(skillAssignmentClient.create)
}

const useEditSkillAssignment = () => {
   return useMutation(skillAssignmentClient.update)
}

const useGetSkillAssignment = (id: string) => {
   return useQuery<SkillAssignmentType>(
      [`${API_ROUTES.SKILL_ASSIGNMENT.INDEX}/${id}`],
      () => skillAssignmentClient.findOne(id),
      {
         refetchOnWindowFocus: false
      }
   )
}

const useDeleteSkillAssignment = () => {
   return useMutation(skillAssignmentClient.delete)
}

export {
   useAddSkillAssignment,
   useGetSkillAssignment,
   useGetSkillAssignments,
   useDeleteSkillAssignment,
   useEditSkillAssignment
}
