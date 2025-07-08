import { PartialType } from '@nestjs/swagger'
import { CreateLeaveAssignmentDto } from './create-leave-assignment.dto'

export class UpdateLeaveAssignmentDto extends PartialType(
   CreateLeaveAssignmentDto
) {}
