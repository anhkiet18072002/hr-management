import { PartialType } from '@nestjs/swagger';
import { CreateStaffKeyResultDto } from './create-staff_key_result.dto';

export class UpdateStaffKeyResultDto extends PartialType(CreateStaffKeyResultDto) {}
