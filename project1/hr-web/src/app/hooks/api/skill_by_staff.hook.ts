import { API_ROUTES } from '@/app/configs/route.config'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { useQuery } from 'react-query'
import { SkillByStaffClient } from './skill_by_staff.api'

const useGetSkillByStaff = (query: BaseApiQueryType) => {
   return useQuery<BaseApiResponseType>(
      [API_ROUTES.SKILL_BY_STAFF.INDEX, query],
      () => SkillByStaffClient.findAll(query),
      {
         refetchOnWindowFocus: false
      }
   )
}
export { useGetSkillByStaff }
