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
import { SkillAssignmentService } from './skill-assignment.service'
import { CreateSkillAssignmentDto } from './dto/create-skill-assignment.dto'
import { UpdateSkillAssignmentDto } from './dto/update-skill-assignment.dto'
import { ApiOperation } from '@nestjs/swagger'
import { User } from 'src/core/decorator/user.decorator'
import { Swagger } from 'src/common/decorator/swagger/swagger.decorator'
import { Permission } from 'src/core/decorator/permission.decorator'
import { PERMISSIONS } from 'src/core/constant'
import { QuerySkillAssignmentDto } from './dto/query-skill-assignment.dto'
import { DashboardInterceptor } from 'src/core/interceptor/dashboard.interceptor'

@UseInterceptors(DashboardInterceptor)
@Swagger('Skill assignment')
@Controller('skill-assignment')
export class SkillAssignmentController {
   constructor(
      private readonly skillAssignmentService: SkillAssignmentService
   ) {}

   @Permission({ AND: [PERMISSIONS.CORE_ADMIN] })
   @ApiOperation({ summary: 'Create a new skill-assignment' })
   @Post()
   create(@User('id') userId: string, @Body() dto: CreateSkillAssignmentDto) {
      return this.skillAssignmentService.create({ userId, ...dto })
   }

   @ApiOperation({ summary: 'Get all skill-assignments' })
   @Get()
   findAll(@Query() query: QuerySkillAssignmentDto) {
      return this.skillAssignmentService.findAll(query)
   }

   @ApiOperation({ summary: 'Get a skill-assignment by its ID' })
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.skillAssignmentService.findOne(id)
   }

   @ApiOperation({ summary: 'Update a skill-assignment by its ID' })
   @Patch(':id')
   update(
      @Param('id') id: string,
      @Body() updateSkillAssignmentDto: UpdateSkillAssignmentDto
   ) {
      return this.skillAssignmentService.update(id, updateSkillAssignmentDto)
   }

   @ApiOperation({ summary: 'Delete a skill-assignment by its ID' })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.skillAssignmentService.remove(id)
   }
}
