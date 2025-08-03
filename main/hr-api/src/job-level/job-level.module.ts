import { Module } from '@nestjs/common'
import { JobLevelService } from './job-level.service'
import { JobLevelController } from './job-level.controller'

@Module({
   controllers: [JobLevelController],
   providers: [JobLevelService]
})
export class JobLevelModule {}
