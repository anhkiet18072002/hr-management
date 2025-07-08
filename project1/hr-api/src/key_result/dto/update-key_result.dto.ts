import { PartialType } from '@nestjs/swagger';
import { CreateKeyResultDto } from './create-key_result.dto';

export class UpdateKeyResultDto extends PartialType(CreateKeyResultDto) {}
