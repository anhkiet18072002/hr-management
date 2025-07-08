import { PartialType } from '@nestjs/swagger'
import { CreateBaseDto } from 'src/core/dto/create-base.dto'

export class UpdateBaseDto extends PartialType(CreateBaseDto) {}
