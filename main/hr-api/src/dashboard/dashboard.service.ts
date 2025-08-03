import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateDashboardDto } from './dto/create-dashboard.dto'
import { UpdateDashboardDto } from './dto/update-dashboard.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { AccountService } from 'src/account/account.service'
import { BaseService } from 'src/core/base.service'

@Injectable()
export class DashboardService extends BaseService {
   defaultSelect: any
   defaultSearchFields?: string[]

   constructor(private readonly prisma: PrismaService) {
      super(prisma.dashboard)
   }

   async CreateChartProject() {
      const projects = await this.prisma.project.findMany({
         select: {
            id: true,
            name: true,
            projectAssignments: {
               select: {
                  staffId: true
               }
            }
         }
      })

      const totalStaff = await this.prisma.staff.count()

      const assignedStaff = new Set(
         projects.flatMap((project) =>
            project.projectAssignments.map((p) => p.staffId)
         )
      )
      const unassignedStaffCount = totalStaff - assignedStaff.size

      const reportData = {
         chartId: 'project',
         label: 'Project by Staff',
         data: JSON.stringify({
            projectName: projects.map((project) => project.name),
            staffCount: projects.map(
               (project) => project.projectAssignments.length
            ),
            unAssignment: unassignedStaffCount
         })
      }

      const newReport = await this.prisma.dashboard.create({
         data: reportData
      })

      return { data: newReport }
   }

   async CreateChartSkill() {
      const skills = await this.prisma.skill.findMany({
         select: {
            id: true,
            name: true,
            skillAssignments: {
               select: {
                  staffId: true
               }
            }
         }
      })

      const totalStaff = await this.prisma.staff.count()

      const assignedStaff = new Set(
         skills.flatMap((skill) => skill.skillAssignments.map((p) => p.staffId))
      )
      const unassignedStaffCount = totalStaff - assignedStaff.size

      const reportData = {
         chartId: 'skill',
         label: 'Skill by Staff',
         data: JSON.stringify({
            skillName: skills.map((skill) => skill.name),
            staffCount: skills.map((skill) => skill.skillAssignments.length),
            unAssignment: unassignedStaffCount
         })
      }

      const newReport = await this.prisma.dashboard.create({
         data: reportData
      })

      return { data: newReport }
   }

   async CreateChartTopSkill() {
      const skills = await this.prisma.skill.findMany({
         select: {
            id: true,
            name: true,
            skillAssignments: {
               select: {
                  level: {
                     select: {
                        ordinal: true
                     }
                  }
               }
            }
         }
      })

      const skillsWithAverage = skills.map((skill) => {
         const total = skill.skillAssignments.reduce(
            (sum, assignment) => sum + assignment.level.ordinal,
            0
         )
         const average = skill.skillAssignments.length
            ? total / skill.skillAssignments.length
            : 0

         return {
            name: skill.name,
            averageLevel: parseFloat(average.toFixed(2))
         }
      })

      const reportData = {
         chartId: 'top-skill',
         label: 'Skill by Average Level',
         data: JSON.stringify({
            skillName: skillsWithAverage.map((s) => s.name),
            averageLevel: skillsWithAverage.map((s) => s.averageLevel)
         })
      }

      const newReport = await this.prisma.dashboard.create({
         data: reportData
      })

      return { data: newReport }
   }

   async GetOne(chartId: string) {
      const dashboard = await this.prisma.dashboard.findUnique({
         where: { chartId }
      })
      if (!dashboard) {
         throw new NotFoundException(
            `Dashboard with chartId: ${chartId} does not exist or has been removed`
         )
      }
      const parseData = JSON.parse(dashboard.data)
      return {
         ...dashboard,
         data: parseData
      }
   }

   async update(chartId: string) {
      const dashboard = await this.prisma.dashboard.findUnique({
         where: { chartId }
      })
      if (!dashboard) {
         throw new NotFoundException(
            `Dashboard with chartId: ${chartId} does not exist or has been removed`
         )
      }

      if (chartId === 'project') {
         const projects = await this.prisma.project.findMany({
            select: {
               id: true,
               name: true,
               projectAssignments: {
                  select: {
                     staffId: true
                  }
               }
            }
         })

         const totalStaff = await this.prisma.staff.count()

         const assignedStaff = new Set(
            projects.flatMap((project) =>
               project.projectAssignments.map((p) => p.staffId)
            )
         )
         const unassignedStaffCount = totalStaff - assignedStaff.size

         const newData = {
            projectName: projects.map((project) => project.name),
            staffCount: projects.map(
               (project) => project.projectAssignments.length
            ),
            unAssignment: unassignedStaffCount
         }

         // So sánh object thay vì chuỗi JSON
         const currentData = JSON.parse(dashboard.data)
         const hasChanges =
            JSON.stringify(newData) !== JSON.stringify(currentData)

         if (hasChanges) {
            await this.prisma.dashboard.update({
               where: { chartId },
               data: {
                  data: JSON.stringify(newData)
               }
            })
            return { message: 'Dashboard updated successfully' }
         }
      } else if (chartId === 'skill') {
         const skills = await this.prisma.skill.findMany({
            select: {
               id: true,
               name: true,
               skillAssignments: {
                  select: {
                     staffId: true
                  }
               }
            }
         })

         const totalStaff = await this.prisma.staff.count()

         const assignedStaff = new Set(
            skills.flatMap((skill) =>
               skill.skillAssignments.map((p) => p.staffId)
            )
         )
         const unassignedStaffCount = totalStaff - assignedStaff.size

         const newData = {
            skillName: skills.map((skill) => skill.name),
            staffCount: skills.map((skill) => skill.skillAssignments.length),
            unAssignment: unassignedStaffCount
         }

         // So sánh object thay vì chuỗi JSON
         const currentData = JSON.parse(dashboard.data)
         const hasChanges =
            JSON.stringify(newData) !== JSON.stringify(currentData)

         if (hasChanges) {
            await this.prisma.dashboard.update({
               where: { chartId },
               data: {
                  data: JSON.stringify(newData)
               }
            })
            return { message: 'Dashboard updated successfully' }
         }
      } else if (chartId === 'top-skill') {
         const skills = await this.prisma.skill.findMany({
            select: {
               id: true,
               name: true,
               skillAssignments: {
                  select: {
                     level: {
                        select: {
                           ordinal: true
                        }
                     }
                  }
               }
            }
         })

         const skillsWithAverage = skills.map((skill) => {
            const total = skill.skillAssignments.reduce(
               (sum, assignment) => sum + assignment.level.ordinal,
               0
            )
            const average = skill.skillAssignments.length
               ? total / skill.skillAssignments.length
               : 0

            return {
               name: skill.name,
               averageLevel: parseFloat(average.toFixed(2))
            }
         })

         const newData = {
            skillName: skillsWithAverage.map((s) => s.name),
            averageLevel: skillsWithAverage.map((s) => s.averageLevel)
         }

         const currentData = JSON.parse(dashboard.data)
         const hasChanges =
            JSON.stringify(newData) !== JSON.stringify(currentData)

         if (hasChanges) {
            await this.prisma.dashboard.update({
               where: { chartId },
               data: {
                  data: JSON.stringify(newData)
               }
            })
            return { message: 'Dashboard updated successfully' }
         }
      }
      return { message: 'No changes detected, Dashboard remains the same' }
   }
}
