import {
   Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete
} from '@nestjs/common'
import { StaffKeyResultService } from './staff_key_result.service'
import { CreateStaffKeyResultDto } from './dto/create-staff_key_result.dto'
import { UpdateStaffKeyResultDto } from './dto/update-staff_key_result.dto'

@Controller('staff_key_result')
export class StaffKeyResultController {
   constructor(private readonly staffKeyResultService: StaffKeyResultService) {}

   @Post()
   create(@Body() createStaffKeyResultDto: CreateStaffKeyResultDto) {
      return this.staffKeyResultService.create(createStaffKeyResultDto)
   }

   @Get()
   findAll() {
      return this.staffKeyResultService.findAll()
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.staffKeyResultService.findOne(id)
   }

   @Patch(':id')
   update(
      @Param('id') id: string,
      @Body() updateStaffKeyResultDto: UpdateStaffKeyResultDto
   ) {
      return this.staffKeyResultService.update(id, updateStaffKeyResultDto)
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.staffKeyResultService.remove(id)
   }
}
