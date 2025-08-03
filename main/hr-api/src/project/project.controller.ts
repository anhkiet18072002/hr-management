import {
   Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete,
   Query,
   UseInterceptors
} from '@nestjs/common'
import { ProjectService } from './project.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { ApiOperation } from '@nestjs/swagger'
import { Swagger } from 'src/common/decorator/swagger/swagger.decorator'
import { QueryProjectDto } from './dto/query-project.dto'
import { DashboardInterceptor } from 'src/core/interceptor/dashboard.interceptor'

@UseInterceptors(DashboardInterceptor)
@Swagger('Project')
@Controller('project')
export class ProjectController {
   constructor(private readonly projectService: ProjectService) {}

   @ApiOperation({ summary: 'Create a new project' })
   @Post()
   create(@Body() createProjectDto: CreateProjectDto) {
      return this.projectService.create(createProjectDto)
   }

   @ApiOperation({ summary: 'Get all projects' })
   @Get()
   findAll(@Query() query: QueryProjectDto) {
      return this.projectService.findAll(query)
   }

   @ApiOperation({ summary: 'Get project by its ID' })
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.projectService.findOne(id)
   }

   @ApiOperation({ summary: 'Update project by its ID' })
   @Patch(':id')
   update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
      return this.projectService.update(id, updateProjectDto)
   }

   @ApiOperation({ summary: 'Delete project by its ID' })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.projectService.remove(id)
   }
}
