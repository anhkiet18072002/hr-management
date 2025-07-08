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
import { ObjectiveService } from './objective.service'
import { CreateObjectiveDto } from './dto/create-objective.dto'
import { UpdateObjectiveDto } from './dto/update-objective.dto'
import { QueryObjectiveDto } from './dto/query-objective.dto'

@Controller('objective')
export class ObjectiveController {
   constructor(private readonly objectiveService: ObjectiveService) {}

   @Post()
   create(@Body() createObjectiveDto: CreateObjectiveDto) {
      return this.objectiveService.create(createObjectiveDto)
   }

   @Get()
   findAll(@Query() query: QueryObjectiveDto) {
      return this.objectiveService.findAll(query)
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.objectiveService.findOne(id)
   }

   @Patch(':id')
   update(
      @Param('id') id: string,
      @Body() updateObjectiveDto: UpdateObjectiveDto
   ) {
      return this.objectiveService.update(id, updateObjectiveDto)
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.objectiveService.remove(id)
   }
}
