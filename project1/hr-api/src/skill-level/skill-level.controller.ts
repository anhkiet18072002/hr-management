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
import { SkillLevelService } from './skill-level.service'
import { CreateSkillLevelDto } from './dto/create-skill-level.dto'
import { UpdateSkillLevelDto } from './dto/update-skill-level.dto'
import { Swagger } from 'src/common/decorator/swagger/swagger.decorator'
import { ApiOperation } from '@nestjs/swagger'
import { QuerySkillLevelDto } from 'src/skill-level/dto/query-skill-level.dto'

@Swagger('Skill level')
@Controller('skill-level')
export class SkillLevelController {
   constructor(private readonly skillLevelService: SkillLevelService) {}

   @ApiOperation({ summary: 'Create a new skill level' })
   @Post()
   create(@Body() dto: CreateSkillLevelDto) {
      return this.skillLevelService.create(dto)
   }

   @ApiOperation({ summary: 'Get all skill levels by its ID' })
   @Get()
   findAll(@Query() query: QuerySkillLevelDto) {
      return this.skillLevelService.findAll(query)
   }

   @ApiOperation({ summary: 'Get a skill level by its ID' })
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.skillLevelService.findOne(id)
   }

   @ApiOperation({ summary: 'Update a skill level by its ID' })
   @Patch(':id')
   update(@Param('id') id: string, @Body() dto: UpdateSkillLevelDto) {
      return this.skillLevelService.update(id, dto)
   }

   @ApiOperation({ summary: 'Delete a skill level by its ID' })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.skillLevelService.remove(id)
   }
}
