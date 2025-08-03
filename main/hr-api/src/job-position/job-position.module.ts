import { Module } from '@nestjs/common'
import { JobPositionService } from './job-position.service'
import { JobPositionController } from './job-position.controller'

@Module({
   controllers: [JobPositionController],
   providers: [JobPositionService]
})
export class JobPositionModule {}
