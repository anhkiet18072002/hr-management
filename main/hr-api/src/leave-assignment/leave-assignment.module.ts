import { Module } from '@nestjs/common'
import { LeaveAssignmentService } from './leave-assignment.service'
import { LeaveAssignmentController } from './leave-assignment.controller'

@Module({
   controllers: [LeaveAssignmentController],
   providers: [LeaveAssignmentService]
})
export class LeaveAssignmentModule {}
