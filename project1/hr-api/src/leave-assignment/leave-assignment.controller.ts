import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
   Query
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { Swagger } from 'src/common/decorator/swagger/swagger.decorator'
import { CreateLeaveAssignmentDto } from './dto/create-leave-assignment.dto'
import { QueryLeaveAssignmentDto } from './dto/query-leave-assignment.dto'
import { UpdateLeaveAssignmentDto } from './dto/update-leave-assignment.dto'
import { LeaveAssignmentService } from './leave-assignment.service'

@Swagger('Leave assignment')
@Controller('leave-assignment')
export class LeaveAssignmentController {
   constructor(
      private readonly leaveAssignmentService: LeaveAssignmentService
   ) {}

   @ApiOperation({ summary: 'Create a new leave assignment' })
   @Post()
   create(@Body() dto: CreateLeaveAssignmentDto) {
      return this.leaveAssignmentService.create(dto)
   }

   @ApiOperation({ summary: 'Get all leave assignments' })
   @Get()
   findAll(@Query() query: QueryLeaveAssignmentDto) {
      return this.leaveAssignmentService.findAll(query)
   }

   @ApiOperation({ summary: 'Get leave assignment by its ID' })
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.leaveAssignmentService.findOne(id)
   }

   @ApiOperation({ summary: 'Update leave assignment by its ID' })
   @Patch(':id')
   update(
      @Param('id') id: string,
      @Body() updateLeaveAssignmentDto: UpdateLeaveAssignmentDto
   ) {
      return this.leaveAssignmentService.update(id, updateLeaveAssignmentDto)
   }

   @ApiOperation({ summary: 'Delete leave assignment by its ID' })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.leaveAssignmentService.remove(id)
   }
}
