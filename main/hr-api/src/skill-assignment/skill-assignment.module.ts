import { Module } from '@nestjs/common'
import { SkillAssignmentService } from './skill-assignment.service'
import { SkillAssignmentController } from './skill-assignment.controller'
import { StaffService } from 'src/staff/staff.service'
import { AccountService } from 'src/account/account.service'
import { FileStorageService } from 'src/file-storage/file-storage.service'
import { DashboardService } from 'src/dashboard/dashboard.service'

@Module({
   controllers: [SkillAssignmentController],
   providers: [
      SkillAssignmentService,
      StaffService,
      AccountService,
      DashboardService,
      FileStorageService
   ]
})
export class SkillAssignmentModule {}
