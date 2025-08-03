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
import { KeyResultService } from './key_result.service'
import { CreateKeyResultDto } from './dto/create-key_result.dto'
import { UpdateKeyResultDto } from './dto/update-key_result.dto'
import { QueryKeyResultDto } from './dto/query-key-result-dto'

@Controller('key_result')
export class KeyResultController {
   constructor(private readonly keyResultService: KeyResultService) {}

   @Post()
   create(@Body() createKeyResultDto: CreateKeyResultDto) {
      return this.keyResultService.create(createKeyResultDto)
   }

   @Get()
   findAll(@Query() query: QueryKeyResultDto) {
      return this.keyResultService.findAll(query)
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.keyResultService.findOne(id)
   }

   @Patch(':id')
   update(
      @Param('id') id: string,
      @Body() updateKeyResultDto: UpdateKeyResultDto
   ) {
      return this.keyResultService.update(id, updateKeyResultDto)
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.keyResultService.remove(id)
   }
}
