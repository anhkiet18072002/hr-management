import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import * as dayjs from 'dayjs'
import { baseSelect, BaseService } from 'src/core/base.service'
import { DashboardService } from 'src/dashboard/dashboard.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { connect } from 'http2'
import { UpdateBaseDto } from 'src/core/dto/update-base.dto'
import { UpdateProjectDto } from './dto/update-project.dto'

@Injectable()
export class ProjectService extends BaseService {
   defaultSelect: Prisma.ProjectSelect = {
      ...baseSelect,
      name: true,
      description: true,
      priority: true,
      status: true,

      type: {
         select: {
            id: true,
            name: true,
            description: true
         }
      },
      projectAssignments: {
         include: {
            staff: {
               select: {
                  id: true,
                  middleName: true,
                  firstName: true,
                  lastName: true,
                  account: {
                     select: {
                        email: true
                     }
                  }
               }
            },
            role: true
         }
      },

      priceType: {
         select: {
            id: true,
            name: true,
            description: true
         }
      },
      startDate: true,
      endDate: true
   }
   defaultSearchFields?: string[] = ['name', 'description']

   constructor(
      readonly prisma: PrismaService,
      readonly dashboardService: DashboardService
   ) {
      super(prisma.project)
   }

   override async create(dto: CreateProjectDto): Promise<any> {
      const data = {
         ...dto,
         startDate: dayjs(dto.startDate).startOf('day').toDate(),
         endDate: dto.endDate
            ? dayjs(dto.endDate).endOf('day').toDate()
            : undefined
      }

      const expandedAssignments = []

      if (dto.projectAssignments && dto.projectAssignments.length > 0) {
         for (const pa of dto.projectAssignments || []) {
            const staff = await this.prisma.staff.findUnique({
               where: { id: pa.staffId }
            })
            if (!staff) {
               throw new BadRequestException(
                  `The staff with id: ${pa.staffId} does not exist or has been removed`
               )
            }

            const roleIds = Array.isArray(pa.roleId) ? pa.roleId : [pa.roleId]

            for (const roleId of roleIds) {
               const role = await this.prisma.projectRole.findUnique({
                  where: { id: roleId }
               })
               if (!role) {
                  throw new BadRequestException(
                     `The project role with id: ${roleId} does not exist or has been removed`
                  )
               }

               expandedAssignments.push({
                  staffId: pa.staffId,
                  roleId: roleId,
                  workload: pa.workload,
                  startDate: new Date(pa.startDate),
                  ...(pa.endDate && { endDate: new Date(pa.endDate) })
               })
            }
         }
      }

      const project = await this.prisma.project.create({
         data: {
            ...dto,
            startDate: data.startDate,
            endDate: data.endDate,
            ...(dto.projectAssignments && {
               projectAssignments: {
                  createMany: {
                     data: expandedAssignments
                  }
               }
            })
         },
         select: this.defaultSelect
      })

      return project
   }

   override async update(id: string, dto: UpdateProjectDto): Promise<any> {
      const project = await this.prisma.project.findUnique({
         where: { id },
         select: this.defaultSelect
      })

      if (!project) {
         throw new BadRequestException(
            `The project with ID: ${id} does not exist or has been removed`
         )
      }

      const expandedAssignments = []

      if (dto.projectAssignments && dto.projectAssignments.length > 0) {
         for (const pa of dto.projectAssignments || []) {
            const staff = await this.prisma.staff.findUnique({
               where: { id: pa.staffId }
            })
            if (!staff) {
               throw new BadRequestException(
                  `The staff with id: ${pa.staffId} does not exist or has been removed`
               )
            }

            const roleIds = Array.isArray(pa.roleId) ? pa.roleId : [pa.roleId]

            for (const roleId of roleIds) {
               const role = await this.prisma.projectRole.findUnique({
                  where: { id: roleId }
               })
               if (!role) {
                  throw new BadRequestException(
                     `The project role with id: ${roleId} does not exist or has been removed`
                  )
               }

               expandedAssignments.push({
                  staffId: pa.staffId,
                  roleId: roleId,
                  workload: pa.workload,
                  startDate: new Date(pa.startDate),
                  ...(pa.endDate && { endDate: new Date(pa.endDate) })
               })
            }
         }
      }

      if (!dto.projectAssignments) {
         await this.prisma.projectAssignment.deleteMany({
            where: {
               projectId: id
            }
         })
      }

      const project_update = await this.prisma.project.update({
         where: { id },
         data: {
            ...dto,
            ...(dto.projectAssignments && {
               projectAssignments: {
                  deleteMany: {},
                  createMany: {
                     data: expandedAssignments
                  }
               }
            })
         }
      })

      return project_update
   }
}
