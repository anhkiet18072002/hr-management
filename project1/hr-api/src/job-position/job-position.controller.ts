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
import { JobPositionService } from './job-position.service'
import { CreateJobPositionDto } from './dto/create-job-position.dto'
import { UpdateJobPositionDto } from './dto/update-job-position.dto'
import { Permission } from 'src/core/decorator/permission.decorator'
import { ApiOperation } from '@nestjs/swagger'
import { PERMISSIONS } from 'src/core/constant'
import { QueryJobPositionDto } from 'src/job-position/dto'

@Controller('job-position')
export class JobPositionController {
   constructor(private readonly jobPositionService: JobPositionService) {}

   @Permission({ AND: [PERMISSIONS.JOB_POSITION.MANAGE] })
   @ApiOperation({ summary: 'Create a new job position' })
   @Post()
   create(@Body() dto: CreateJobPositionDto) {
      return this.jobPositionService.create(dto)
   }

   // @Permission({ AND: [PERMISSIONS.JOB_POSITION.READ] })
   @ApiOperation({ summary: 'Find all job positions' })
   @Get()
   findAll(@Query() query: QueryJobPositionDto) {
      return this.jobPositionService.findAll(query)
   }

   @Permission({ AND: [PERMISSIONS.JOB_POSITION.READ] })
   @ApiOperation({ summary: 'Find a job position by its ID' })
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.jobPositionService.findOne(id)
   }

   @Permission({ AND: [PERMISSIONS.JOB_POSITION.MANAGE] })
   @ApiOperation({ summary: 'Update a job position by its ID' })
   @Patch(':id')
   update(@Param('id') id: string, @Body() dto: UpdateJobPositionDto) {
      return this.jobPositionService.update(id, dto)
   }

   @Permission({ AND: [PERMISSIONS.JOB_POSITION.MANAGE] })
   @ApiOperation({ summary: 'Delete a job position' })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.jobPositionService.remove(id)
   }
}
