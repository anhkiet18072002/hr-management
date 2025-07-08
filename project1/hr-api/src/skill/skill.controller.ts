import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
   Query,
   UploadedFile,
   UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation } from '@nestjs/swagger'
import { DashboardInterceptor } from 'src/core/interceptor/dashboard.interceptor'
import { FileStorageService } from 'src/file-storage/file-storage.service'
import { storage } from 'src/storage/path.storage'
import { CreateSkillDto } from './dto/create-skill.dto'
import { QuerySkillDto } from './dto/query-skill.dto'
import { UpdateSkillDto } from './dto/update-skill.dto'
import { SkillService } from './skill.service'
import { FileImageValidationPipe } from 'src/core/pipe/file-image.validation.pipe'
import { FileSizeValidationPipe } from 'src/core/pipe/file-size.validation.pipe'

@UseInterceptors(DashboardInterceptor)
@Controller('skill')
export class SkillController {
   constructor(
      private readonly skillService: SkillService,
      private readonly fileStorageService: FileStorageService
   ) {}

   @ApiOperation({ summary: 'Create a new skill' })
   @Post()
   create(@Body() dto: CreateSkillDto) {
      return this.skillService.create(dto)
   }

   @ApiOperation({ summary: 'Get all skills' })
   @Get()
   findAll(@Query() query: QuerySkillDto) {
      return this.skillService.findAll(query)
   }

   @ApiOperation({ summary: 'Get a skill by its ID' })
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.skillService.findOne(id)
   }

   @ApiOperation({ summary: 'Update a skill by its ID' })
   @Patch(':id')
   @UseInterceptors(
      FileInterceptor('file', { storage: storage('skill/thumbnail') })
   )
   async update(
      @Param('id') id: string,
      @Body() dto: UpdateSkillDto,
      @UploadedFile(new FileSizeValidationPipe(), new FileImageValidationPipe())
      fileData: {
         file: Express.Multer.File
         extension: string
      }
   ) {
      if (fileData) {
         const file = await this.fileStorageService.create({
            name: fileData.file.originalname,
            url: fileData.file.path,
            size: fileData.file.size,
            extension: fileData.extension,
            context: 'skill/thumbnail'
         })
         dto.thumbnailId = file.id
      }

      return this.skillService.update(id, dto)
   }

   @ApiOperation({ summary: 'Delete a skill by its ID' })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.skillService.remove(id)
   }
}
