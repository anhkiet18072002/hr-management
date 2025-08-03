import { PartialType } from '@nestjs/swagger'
import { CreateProjectPriceTypeDto } from './create-project-price-type.dto'

export class UpdateProjectPriceTypeDto extends PartialType(
   CreateProjectPriceTypeDto
) {}
