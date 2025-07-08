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
import { PERMISSIONS } from 'src/core/constant'
import { Permission } from 'src/core/decorator/permission.decorator'
import { CreateLeaveTypeDto } from 'src/leave-type/dto/create-leave-type.dto'
import { QueryLeaveTypeDto } from 'src/leave-type/dto/query-leave-type.dto'
import { UpdateLeaveTypeDto } from 'src/leave-type/dto/update-leave-type.dto'
import { LeaveTypeService } from './leave-type.service'

@Swagger('Leave type')
@Controller('leave-type')
export class LeaveTypeController {
   constructor(private readonly leaveTypeService: LeaveTypeService) {}

   @Permission({ AND: [PERMISSIONS.LEAVE_TYPE.MANAGE] })
   @ApiOperation({ summary: 'Create a new leave type' })
   @Post()
   create(@Body() dto: CreateLeaveTypeDto) {
      return this.leaveTypeService.create(dto)
   }

   @ApiOperation({ summary: 'Get all leave types' })
   @Get()
   findAll(@Query() query: QueryLeaveTypeDto) {
      return this.leaveTypeService.findAll(query)
   }

   @ApiOperation({ summary: 'Get leave type by its ID' })
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.leaveTypeService.findOne(id)
   }

   @Permission({ AND: [PERMISSIONS.LEAVE_TYPE.MANAGE] })
   @ApiOperation({ summary: 'Update leave type by its ID' })
   @Patch(':id')
   update(@Param('id') id: string, @Body() dto: UpdateLeaveTypeDto) {
      return this.leaveTypeService.update(id, dto)
   }

   @Permission({ AND: [PERMISSIONS.LEAVE_TYPE.MANAGE] })
   @ApiOperation({ summary: 'Delete leave type by its ID' })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.leaveTypeService.remove(id)
   }
}
