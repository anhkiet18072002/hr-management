import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'

export const SkillByStaffClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(
         API_ROUTES.SKILL_BY_STAFF.INDEX,
         params
      )
   }
}
