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
import { QueryJobLevelDto } from 'src/job-level/dto/query-job-level.dto'
import { CreateJobLevelDto } from './dto/create-job-level.dto'
import { UpdateJobLevelDto } from './dto/update-job-level.dto'
import { JobLevelService } from './job-level.service'

@Swagger('Job level')
@Controller('job-level')
export class JobLevelController {
   constructor(private readonly jobLevelService: JobLevelService) {}

   @ApiOperation({ summary: 'Create a new job level' })
   @Post()
   create(@Body() dto: CreateJobLevelDto) {
      return this.jobLevelService.create(dto)
   }

   @ApiOperation({ summary: 'Find all job levels' })
   @Get()
   findAll(@Query() query: QueryJobLevelDto) {
      return this.jobLevelService.findAll(query)
   }

   @ApiOperation({ summary: 'Find a job level by its ID' })
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.jobLevelService.findOne(id)
   }

   @ApiOperation({ summary: 'Update a job level by its ID' })
   @Patch(':id')
   update(@Param('id') id: string, @Body() dto: UpdateJobLevelDto) {
      return this.jobLevelService.update(id, dto)
   }

   @ApiOperation({ summary: 'Delete a job level by its ID' })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.jobLevelService.remove(id)
   }
}
