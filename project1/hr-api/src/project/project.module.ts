import { Module } from '@nestjs/common'
import { ProjectService } from './project.service'
import { ProjectController } from './project.controller'
import { DashboardService } from 'src/dashboard/dashboard.service'

@Module({
   controllers: [ProjectController],
   providers: [ProjectService, DashboardService]
})
export class ProjectModule {}
