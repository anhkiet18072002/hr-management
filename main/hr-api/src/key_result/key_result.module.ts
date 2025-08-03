import { Module } from '@nestjs/common';
import { KeyResultService } from './key_result.service';
import { KeyResultController } from './key_result.controller';

@Module({
  controllers: [KeyResultController],
  providers: [KeyResultService],
})
export class KeyResultModule {}
