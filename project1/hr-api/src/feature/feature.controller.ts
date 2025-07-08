import {
   Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete,
   Query
} from '@nestjs/common'
import { FeatureService } from './feature.service'
import { CreateFeatureDto } from './dto/create-feature.dto'
import { UpdateFeatureDto } from './dto/update-feature.dto'
import { Swagger } from 'src/common/decorator/swagger/swagger.decorator'
import { ApiOperation } from '@nestjs/swagger'
import { Permission } from 'src/core/decorator/permission.decorator'
import { PERMISSIONS } from 'src/core/constant'

@Swagger('Feature')
@Controller('feature')
export class FeatureController {
   constructor(private readonly featureService: FeatureService) {}

   @ApiOperation({ summary: 'Create a new feature for permission management' })
   @Permission({ AND: [PERMISSIONS.CORE_ADMIN] })
   @Post()
   create(@Body() createFeatureDto: CreateFeatureDto) {
      return this.featureService.create(createFeatureDto)
   }

   @ApiOperation({ summary: 'Find all features for permission management' })
   @Permission({ AND: [PERMISSIONS.CORE_ADMIN] })
   @Get()
   findAll(@Query() query: any) {
      return this.featureService.findAll(query)
   }

   @ApiOperation({ summary: 'Find a feature for permission management' })
   @Permission({ AND: [PERMISSIONS.CORE_ADMIN] })
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.featureService.findOne(id)
   }

   @ApiOperation({ summary: 'Update a feature for permission management' })
   @Permission({ AND: [PERMISSIONS.CORE_ADMIN] })
   @Patch(':id')
   update(@Param('id') id: string, @Body() updateFeatureDto: UpdateFeatureDto) {
      return this.featureService.update(id, updateFeatureDto)
   }

   @ApiOperation({ summary: 'Delete a feature for permission management' })
   @Permission({ AND: [PERMISSIONS.CORE_ADMIN] })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.featureService.remove(id)
   }
}
