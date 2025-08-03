import { Injectable } from '@nestjs/common'
import { CreateProjectRoleDto } from './dto/create-project-role.dto'
import { UpdateProjectRoleDto } from './dto/update-project-role.dto'
import { baseSelect, BaseService } from 'src/core/base.service'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ProjectRoleService extends BaseService {
   defaultSelect: Prisma.ProjectRoleSelect = {
      ...baseSelect,
      name: true,
      description: true
   }
   defaultSearchFields?: string[] = ['name', 'description']

   constructor(readonly prisma: PrismaService) {
      super(prisma.projectRole)
   }
}
