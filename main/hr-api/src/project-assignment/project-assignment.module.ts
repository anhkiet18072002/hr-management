import { Module } from '@nestjs/common'
import { ProjectAssignmentService } from './project-assignment.service'
import { ProjectAssignmentController } from './project-assignment.controller'
import { DashboardService } from 'src/dashboard/dashboard.service'

@Module({
   controllers: [ProjectAssignmentController],
   providers: [ProjectAssignmentService, DashboardService]
})
export class ProjectAssignmentModule {}
