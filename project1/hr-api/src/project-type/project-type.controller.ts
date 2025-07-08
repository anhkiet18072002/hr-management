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
import { ProjectTypeService } from './project-type.service'
import { CreateProjectTypeDto } from './dto/create-project-type.dto'
import { UpdateProjectTypeDto } from './dto/update-project-type.dto'
import { ApiOperation } from '@nestjs/swagger'
import { Swagger } from 'src/common/decorator/swagger/swagger.decorator'
import { QueryProjectTypeDto } from './dto/query-project-type.dto'

@Swagger('Project type')
@Controller('project-type')
export class ProjectTypeController {
   constructor(private readonly projectTypeService: ProjectTypeService) {}

   @ApiOperation({ summary: 'Create a new project type' })
   @Post()
   create(@Body() createProjectTypeDto: CreateProjectTypeDto) {
      return this.projectTypeService.create(createProjectTypeDto)
   }

   @ApiOperation({ summary: 'Get all project types' })
   @Get()
   findAll(@Query() query: QueryProjectTypeDto) {
      return this.projectTypeService.findAll(query)
   }

   @Get('more')
   getMore() {
      return this.projectTypeService.getMore()
   }

   @ApiOperation({ summary: 'Get project type by ID' })
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.projectTypeService.findOne(id)
   }

   @ApiOperation({ summary: 'Update project type by its ID' })
   @Patch(':id')
   update(
      @Param('id') id: string,
      @Body() updateProjectTypeDto: UpdateProjectTypeDto
   ) {
      return this.projectTypeService.update(id, updateProjectTypeDto)
   }

   @ApiOperation({ summary: 'Delete project type by its ID' })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.projectTypeService.remove(id)
   }
}
