import { useMutation } from 'react-query'
import { DashboardClient } from './dashboard.api'

const useGetDashboardProject = () => {
   return useMutation(DashboardClient.findOneProject)
}

const useGetDashboardSkill = () => {
   return useMutation(DashboardClient.findOneSkill)
}

const useGetDashboardSkillLevel = () =>{
   return useMutation(DashboardClient.findOneSkillLevel)
}
const useUpdateDashboardSkillLevel = () => {
   return useMutation(DashboardClient.updateOneSkillLevel)
}

export { useGetDashboardProject, useGetDashboardSkill, useGetDashboardSkillLevel, useUpdateDashboardSkillLevel }
