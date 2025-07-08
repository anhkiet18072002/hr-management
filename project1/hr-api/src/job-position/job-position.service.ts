import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { baseSelect, BaseService } from 'src/core/base.service'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class JobPositionService extends BaseService {
   readonly defaultSelect: Prisma.JobPositionSelect = {
      ...baseSelect,
      name: true,
      description: true,
      shortName: true,
      specification: true,
      staffs: true
   }

   readonly defaultSearchFields?: Prisma.JobPositionScalarFieldEnum[] = [
      'name',
      'shortName'
   ]

   constructor(readonly prisma: PrismaService) {
      super(prisma.jobPosition)
   }
}
