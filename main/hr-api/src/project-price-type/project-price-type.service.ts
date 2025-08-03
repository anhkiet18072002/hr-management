import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { baseSelect, BaseService } from 'src/core/base.service'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ProjectPriceTypeService extends BaseService {
   defaultSelect: Prisma.ProjectPriceTypeSelect = {
      ...baseSelect,
      name: true,
      description: true
   }
   defaultSearchFields?: string[] = ['name', 'description']

   constructor(readonly prisma: PrismaService) {
      super(prisma.projectPriceType)
   }
}
