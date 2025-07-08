import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
   Query,
   UseInterceptors
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { Swagger } from 'src/common/decorator/swagger/swagger.decorator'
import { CreateProjectAssignmentDto } from './dto/create-project-assignment.dto'
import { QueryProjectAssignmentDto } from './dto/query-project-assignment.dto'
import { UpdateProjectAssignmentDto } from './dto/update-project-assignment.dto'
import { ProjectAssignmentService } from './project-assignment.service'
import { DashboardInterceptor } from 'src/core/interceptor/dashboard.interceptor'

@UseInterceptors(DashboardInterceptor)
@Swagger('Project assignment')
@Controller('project-assignment')
export class ProjectAssignmentController {
   constructor(
      private readonly projectAssignmentService: ProjectAssignmentService
   ) {}

   @ApiOperation({ summary: 'Create a new project assignment' })
   @Post()
   create(@Body() dto: CreateProjectAssignmentDto) {
      return this.projectAssignmentService.create(dto)
   }

   @ApiOperation({ summary: 'Get all project assignments' })
   @Get()
   findAll(@Query() query: QueryProjectAssignmentDto) {
      return this.projectAssignmentService.findAll(query)
   }

   @ApiOperation({ summary: 'Get project assignment by ID' })
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.projectAssignmentService.findOne(id)
   }

   @ApiOperation({ summary: 'Update project assignment by its ID' })
   @Patch(':id')
   update(@Param('id') id: string, @Body() dto: UpdateProjectAssignmentDto) {
      return this.projectAssignmentService.update(id, dto)
   }

   @ApiOperation({ summary: 'Delete project assignment by its ID' })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.projectAssignmentService.remove(id)
   }
}
