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
import { ProjectRoleService } from './project-role.service'
import { CreateProjectRoleDto } from './dto/create-project-role.dto'
import { UpdateProjectRoleDto } from './dto/update-project-role.dto'
import { ApiOperation } from '@nestjs/swagger'
import { Swagger } from 'src/common/decorator/swagger/swagger.decorator'
import { QueryProjectRoleDto } from './dto/query-peoject-role.dto'

@Swagger('Project role')
@Controller('project-role')
export class ProjectRoleController {
   constructor(private readonly projectRoleService: ProjectRoleService) {}

   @ApiOperation({ summary: 'Create a new role' })
   @Post()
   create(@Body() createProjectRoleDto: CreateProjectRoleDto) {
      return this.projectRoleService.create(createProjectRoleDto)
   }

   @ApiOperation({ summary: 'Get all roles' })
   @Get()
   findAll(@Query() query: QueryProjectRoleDto) {
      return this.projectRoleService.findAll(query)
   }

   @ApiOperation({ summary: 'Get role by ID' })
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.projectRoleService.findOne(id)
   }

   @ApiOperation({ summary: 'Update role by its ID' })
   @Patch(':id')
   update(
      @Param('id') id: string,
      @Body() updateProjectRoleDto: UpdateProjectRoleDto
   ) {
      return this.projectRoleService.update(id, updateProjectRoleDto)
   }

   @ApiOperation({ summary: 'Delete role by its ID' })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.projectRoleService.remove(id)
   }
}
