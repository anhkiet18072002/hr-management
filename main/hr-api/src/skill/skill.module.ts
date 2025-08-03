import { Module } from '@nestjs/common'
import { SkillController } from './skill.controller'
import { SkillService } from './skill.service'
import { FileStorageService } from 'src/file-storage/file-storage.service'
import { DashboardService } from 'src/dashboard/dashboard.service'

@Module({
   controllers: [SkillController],
   providers: [SkillService, FileStorageService, DashboardService]
})
export class SkillModule {}
