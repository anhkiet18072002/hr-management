import { Module } from '@nestjs/common'
import { ProjectPriceTypeService } from './project-price-type.service'
import { ProjectPriceTypeController } from './project-price-type.controller'

@Module({
   controllers: [ProjectPriceTypeController],
   providers: [ProjectPriceTypeService]
})
export class ProjectPriceTypeModule {}
