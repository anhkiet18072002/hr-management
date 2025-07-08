import { Module } from '@nestjs/common';
import { StaffKeyResultService } from './staff_key_result.service';
import { StaffKeyResultController } from './staff_key_result.controller';

@Module({
  controllers: [StaffKeyResultController],
  providers: [StaffKeyResultService],
})
export class StaffKeyResultModule {}
