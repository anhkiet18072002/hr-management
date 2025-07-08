import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { baseSelect, BaseService } from 'src/core/base.service'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class JobLevelService extends BaseService {
   readonly defaultSelect: Prisma.JobLevelSelect = {
      ...baseSelect,
      name: true,
      description: true
   }

   readonly defaultSearchFields?: string[] = ['name', 'description']

   constructor(readonly prisma: PrismaService) {
      super(prisma.jobLevel)
   }
}
