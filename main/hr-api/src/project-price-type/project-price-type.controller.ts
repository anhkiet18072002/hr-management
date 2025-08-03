import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { Swagger } from 'src/common/decorator/swagger/swagger.decorator'
import { ValidateMongoIdPipe } from 'src/core/pipe/validate-mongoid.pipe'
import { ProjectPriceTypeService } from './project-price-type.service'
import {
   CreateProjectPriceTypeDto,
   QueryProjectPriceTypeDto,
   UpdateProjectPriceTypeDto
} from 'src/project-price-type/dto'
import { Permission } from 'src/core/decorator/permission.decorator'
import { PERMISSIONS } from 'src/core/constant'

@Swagger('Project price type')
@Controller('project-price-type')
export class ProjectPriceTypeController {
   constructor(
      private readonly projectPriceTypeService: ProjectPriceTypeService
   ) {}

   @Permission({ AND: [PERMISSIONS.PROJECT_PRICE_TYPE.MANAGE] })
   @ApiOperation({ summary: 'Create a new project price type' })
   @Post()
   create(@Body() dto: CreateProjectPriceTypeDto) {
      return this.projectPriceTypeService.create(dto)
   }

   @Permission({ AND: [PERMISSIONS.PROJECT_PRICE_TYPE.READ] })
   @ApiOperation({ summary: 'Find all project price types' })
   @Get()
   findAll(query: QueryProjectPriceTypeDto) {
      return this.projectPriceTypeService.findAll(query)
   }

   @Permission({ AND: [PERMISSIONS.PROJECT_PRICE_TYPE.READ] })
   @ApiOperation({ summary: 'Find a project price type' })
   @Get(':id')
   findOne(@Param('id', ValidateMongoIdPipe) id: string) {
      return this.projectPriceTypeService.findOne(id)
   }

   @Permission({ AND: [PERMISSIONS.PROJECT_PRICE_TYPE.MANAGE] })
   @ApiOperation({ summary: 'Update a project price type' })
   @Patch(':id')
   update(@Param('id') id: string, @Body() dto: UpdateProjectPriceTypeDto) {
      return this.projectPriceTypeService.update(id, dto)
   }

   @Permission({ AND: [PERMISSIONS.PROJECT_PRICE_TYPE.MANAGE] })
   @ApiOperation({ summary: 'Delete a project price type' })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.projectPriceTypeService.remove(id)
   }
}
