import { PartialType } from '@nestjs/swagger'
import { CreateSkillAssignmentDto } from './create-skill-assignment.dto'

export class UpdateSkillAssignmentDto extends PartialType(
   CreateSkillAssignmentDto
) {}
