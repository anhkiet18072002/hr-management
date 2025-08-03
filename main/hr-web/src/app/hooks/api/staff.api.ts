import { API_ROUTES } from '@/app/configs/route.config'
import { HttpClient } from '@/app/hooks/api'
import { BaseApiQueryType, BaseApiResponseType } from '@/app/types/common.type'
import { SkillAssignmentType } from '@/app/types/skill.assignment.type'
import { StaffType } from '@/app/types/staff.type'

export const staffClient = {
   findAll: (params?: BaseApiQueryType) => {
      return HttpClient.get<BaseApiResponseType>(API_ROUTES.STAFF.INDEX, params) // staff
   },
   findOne: (id: string) => {
      return HttpClient.get<StaffType>(`${API_ROUTES.STAFF.INDEX}/${id}`)
   },
   create: (payload: Record<string, any>) => {
      return HttpClient.post<StaffType>(API_ROUTES.STAFF.INDEX, {
         ...payload,
         skillAssignments: payload.skillAssignments?.map(
            (assignment: SkillAssignmentType) => ({
               skillId: assignment.skillId,
               levelId: assignment.levelId,
               yearOfExp: assignment.yearOfExp,
               primary: assignment.primary
            })
         )
      })
   },
   updateKeyResult: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<StaffType>(
         `${API_ROUTES.STAFF.INDEX}/${payload?.id}/keyResult`,
         {
            ...payload,
            id: undefined
         }
      )
   },
   update: (payload: { id: string } & Record<string, any>) => {
      return HttpClient.patch<StaffType>(
         `${API_ROUTES.STAFF.INDEX}/${payload?.id}`,
         {
            ...payload,
            id: undefined,
            skillAssignments: payload.skillAssignments?.map(
               (assignment: SkillAssignmentType) => ({
                  skillId: assignment.skillId,
                  levelId: assignment.levelId,
                  yearOfExp: assignment.yearOfExp,
                  primary: assignment.primary
               })
            )
         }
      )
   },
   delete: (id: string) => {
      return HttpClient.delete(`${API_ROUTES.STAFF.INDEX}/${id}`)
   }
}
