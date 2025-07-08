import { Module } from '@nestjs/common'
import { SkillLevelService } from './skill-level.service'
import { SkillLevelController } from './skill-level.controller'

@Module({
   controllers: [SkillLevelController],
   providers: [SkillLevelService]
})
export class SkillLevelModule {}
