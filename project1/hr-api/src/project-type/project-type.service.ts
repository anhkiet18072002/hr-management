import { Injectable } from '@nestjs/common'
import { baseSelect, BaseService } from 'src/core/base.service'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ProjectTypeService extends BaseService {
   defaultSelect: Prisma.ProjectTypeSelect = {
      ...baseSelect,
      name: true,
      description: true
   }

   defaultSearchFields?: string[] = ['name', 'description']

   constructor(readonly prisma: PrismaService) {
      super(prisma.projectType)
   }

   async getMore() {
      return this.prisma.projectType.findMany()
   }
}
