import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import * as dayjs from 'dayjs'
import { baseSelect, BaseService } from 'src/core/base.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateProjectAssignmentDto } from './dto/create-project-assignment.dto'
import { UpdateProjectAssignmentDto } from './dto/update-project-assignment.dto'
import { DashboardService } from 'src/dashboard/dashboard.service'

@Injectable()
export class ProjectAssignmentService extends BaseService {
   defaultSelect: Prisma.ProjectAssignmentSelect = {
      ...baseSelect,
      staff: {
         select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
            accountId: true,
            account: { select: { username: true, email: true } }
         }
      },
      project: {
         select: {
            id: true,
            name: true,
            description: true,
            priority: true,
            type: {
               select: {
                  name: true,
                  description: true
               }
            },
            status: true
         }
      },
      role: {
         select: {
            id: true,
            name: true,
            description: true
         }
      },
      workload: true,
      startDate: true,
      endDate: true
   }

   defaultSearchFields?: string[] = [
      'staff.firstName',
      'staff.lastName',
      'staff.middleName',
      'project.name',
      'project.description'
   ]

   constructor(
      readonly prisma: PrismaService,
      readonly dashboardService: DashboardService
   ) {
      super(prisma.projectAssignment)
   }

   override async create(dto: CreateProjectAssignmentDto): Promise<any> {
      const data: Prisma.ProjectAssignmentUncheckedCreateInput = {
         ...dto,
         startDate: dayjs(dto.startDate).startOf('day').toDate()
      }
      if (dto.endDate) {
         data.endDate = dayjs(dto.endDate).endOf('day').toDate()
      }

      const project = await this.prisma.project.findUnique({
         where: { id: dto.projectId }
      })
      if (!project) {
         throw new BadRequestException(
            `Project with ID: ${dto.projectId} does not exist or has been removed`
         )
      }

      const staff = await this.prisma.staff.findUnique({
         where: { id: dto.staffId }
      })
      if (!staff) {
         throw new BadRequestException(
            `Staff with ID: ${dto.staffId} does not exist or has been removed`
         )
      }

      const role = await this.prisma.projectRole.findUnique({
         where: { id: dto.roleId }
      })
      if (!role) {
         throw new BadRequestException(
            `Role with ID: ${dto.roleId} does not exist or has been removed`
         )
      }

      return await super.create({ ...data })
   }
}
