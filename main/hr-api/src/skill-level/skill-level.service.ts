import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { baseSelect, BaseService } from 'src/core/base.service'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class SkillLevelService extends BaseService {
   defaultSelect: Prisma.SkillLevelSelect = {
      ...baseSelect,
      name: true,
      description: true,
      ordinal: true
   }

   defaultSearchFields?: Partial<Prisma.SkillScalarFieldEnum>[] = [
      'name',
      'description'
   ]

   constructor(readonly prisma: PrismaService) {
      super(prisma.skillLevel)
   }
}
