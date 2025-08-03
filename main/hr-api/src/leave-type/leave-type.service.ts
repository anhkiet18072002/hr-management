import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { baseSelect, BaseService } from 'src/core/base.service'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class LeaveTypeService extends BaseService {
   readonly defaultSelect: Prisma.LeaveTypeSelect = {
      ...baseSelect,
      name: true,
      description: true
   }
   readonly defaultSearchFields?: string[]

   constructor(readonly prisma: PrismaService) {
      super(prisma.leaveType)
   }
}
