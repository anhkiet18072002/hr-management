import { Module } from '@nestjs/common'
import { ProjectRoleService } from './project-role.service'
import { ProjectRoleController } from './project-role.controller'

@Module({
   controllers: [ProjectRoleController],
   providers: [ProjectRoleService]
})
export class ProjectRoleModule {}
