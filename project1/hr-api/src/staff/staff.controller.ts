import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
   Query,
   Res,
   UploadedFile,
   UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation } from '@nestjs/swagger'
import { Response } from 'express'
import { Swagger } from 'src/common/decorator/swagger/swagger.decorator'
import { FileStorageService } from 'src/file-storage/file-storage.service'
import { QueryStaffDto } from 'src/staff/dto/query-staff.dto'
import { storage } from 'src/storage/path.storage'
import { CreateStaffDto } from './dto/create-staff.dto'
import { UpdateStaffDto } from './dto/update-staff.dto'
import { StaffService } from './staff.service'
import {
   FileExcelValidationPipe,
   FileImageValidationPipe,
   FileSizeValidationPipe
} from 'src/core/pipe'

@Swagger('Staff')
@Controller('staff')
export class StaffController {
   constructor(
      private readonly staffService: StaffService,
      private readonly fileStorageService: FileStorageService
   ) {}

   @ApiOperation({ summary: 'Create a new staff information' })
   @Post()
   create(@Body() dto: CreateStaffDto) {
      return this.staffService.create(dto)
   }

   @ApiOperation({ summary: 'Get all staffs' })
   @Get()
   findAll(@Query() query: QueryStaffDto) {
      return this.staffService.findAll(query)
   }

   @Get('export')
   exportXLSX(@Res() res: Response) {
      return this.staffService.getSampleFileXLSX(res as Response)
   }

   @ApiOperation({ summary: 'Get a staff information' })
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.staffService.findOne(id)
   }

   @Patch(':id/keyResult')
   updateKeyResult(@Param('id') id: string, @Body() dto: UpdateStaffDto) {
      return this.staffService.updateStaffKeyResult(id, dto)
   }

   @ApiOperation({ summary: 'Update a staff information' })
   @Patch(':id')
   @UseInterceptors(
      FileInterceptor('file', { storage: storage('staff/avatar') })
   )
   async update(
      @Param('id') id: string,
      @Body() dto: UpdateStaffDto,
      @UploadedFile(new FileSizeValidationPipe(), new FileImageValidationPipe())
      fileData: { file: Express.Multer.File; extension: string }
   ) {
      if (fileData) {
         const file = await this.fileStorageService.create({
            name: fileData.file.originalname,
            url: fileData.file.path,
            size: fileData.file.size,
            extension: fileData.extension,
            context: 'staff/avatar'
         })

         dto.avatarId = file.id
      }

      return this.staffService.update(id, dto)
   }

   @ApiOperation({ summary: 'Delete a staff information' })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.staffService.remove(id)
   }

   @Post('import')
   @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
   async importStaff(
      @UploadedFile(new FileSizeValidationPipe(), new FileExcelValidationPipe())
      file: Express.Multer.File
   ) {
      return this.staffService.importFromExcel(file)
   }
}
