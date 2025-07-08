import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { baseSelect, BaseService } from 'src/core/base.service'
import { CreateLeaveAssignmentDto } from 'src/leave-assignment/dto/create-leave-assignment.dto'
import { Prisma } from '@prisma/client'
import * as dayjs from 'dayjs'
import { UpdateBaseDto } from 'src/core/dto/update-base.dto'
import { UpdateLeaveAssignmentDto } from 'src/leave-assignment/dto/update-leave-assignment.dto'

@Injectable()
export class LeaveAssignmentService extends BaseService {
   readonly defaultSelect: Prisma.LeaveAssignmentSelect = {
      ...baseSelect,
      staff: {
         select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
            accountId: true,
            account: {
               select: {
                  email: true,
                  username: true
               }
            }
         }
      },
      type: {
         select: {
            id: true,
            name: true,
            description: true
         }
      },
      startDate: true,
      endDate: true,
      duration: true,
      reason: true
   }

   readonly defaultSearchFields?: string[] = [
      'reason',
      'staff.firstName',
      'staff.lastName',
      'staff.middleName',
      'staff.account.email',
      'staff.account.username',
      'type.name',
      'type.description'
   ]

   constructor(readonly prisma: PrismaService) {
      super(prisma.leaveAssignment)
   }

   override async create(dto: CreateLeaveAssignmentDto): Promise<any> {
      const startDate = dayjs(dto.startDate).toISOString()
      const endDate = this.calculateEndDate(dto.startDate, dto.duration)

      return await super.create({ ...dto, startDate, endDate })
   }

   override async update(
      id: string,
      dto: UpdateLeaveAssignmentDto
   ): Promise<any> {
      const startDate = dayjs(dto.startDate).toISOString()
      const endDate = this.calculateEndDate(dto.startDate, dto.duration)

      return await super.update(id, { ...dto, startDate, endDate })
   }

   private calculateEndDate(startDate: Date, duration: number) {
      const hourPerDay = 8
      const lunchBreak = 1

      const hours =
         duration <= hourPerDay
            ? duration + lunchBreak
            : duration % hourPerDay !== 0
              ? (Math.floor(duration / hourPerDay) - 1) * 24 +
                (duration % hourPerDay) +
                (Math.floor(duration / hourPerDay) - 1) * lunchBreak
              : (Math.floor(duration / hourPerDay) - 1) * 24 +
                hourPerDay +
                (Math.floor(duration / hourPerDay) - 1) * lunchBreak

      let endDate = dayjs(startDate).add(hours, 'hour')

      // Add day for weekends
      if (endDate.day() === 0) endDate = endDate.add(24, 'hour')
      else if (endDate.day() === 6) endDate = endDate.add(48, 'hour')

      return endDate.toISOString()
   }
}
