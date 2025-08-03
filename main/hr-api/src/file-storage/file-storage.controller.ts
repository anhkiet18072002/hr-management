import {
   BadRequestException,
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   UploadedFile,
   UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger'
import { existsSync, mkdirSync } from 'fs'
import { diskStorage } from 'multer'
import { Swagger } from 'src/common/decorator/swagger/swagger.decorator'
import { FileSizeValidationPipe } from 'src/core/pipe'
import { FileStorageService } from './file-storage.service'
import { v4 } from 'uuid'

@Swagger('File Storage')
@Controller('file-storage')
export class FileStorageController {
   constructor(private readonly fileStorageService: FileStorageService) {}

   @ApiOperation({ summary: 'Upload a new file' })
   @ApiConsumes('multipart/form-data')
   @ApiBody({
      description: 'Upload a file',
      type: 'multipart/form-data',
      schema: {
         type: 'object',
         properties: {
            context: {
               type: 'string',
               description: 'Context of the file upload',
               examples: ['avatar', 'document']
            },
            file: {
               type: 'string',
               description:
                  'File to upload. The file property is required and must be the last param.',
               format: 'binary'
            }
         },
         required: ['file']
      }
   })
   @Post('upload')
   @UseInterceptors(
      FileInterceptor('file', {
         storage: diskStorage({
            destination: (req, file, callback) => {
               const context = req.body.context || 'default'
               const path = `./uploads/${context}`?.replaceAll('//', '/')

               if (!existsSync(path)) {
                  mkdirSync(path, { recursive: true })
               }

               callback(null, path)
            },
            filename: (req, file, callback) => {
               callback(null, `${v4()}.${file.mimetype.split('/')[1]}`)
            }
         })
      })
   )
   async upload(
      @Body('context') context: string,
      @UploadedFile(new FileSizeValidationPipe())
      uploadedFile: { file: Express.Multer.File; extension: string }
   ) {
      if (!uploadedFile?.file) {
         throw new BadRequestException('The file is required')
      }

      const { file } = uploadedFile

      return this.fileStorageService.create({
         name: file.originalname,
         path: file.path,
         size: file.size,
         extension: uploadedFile.extension,
         context: context
      })
   }

   @ApiOperation({ summary: 'Get file by its ID' })
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.fileStorageService.findOne(id)
   }

   @ApiOperation({ summary: 'Delete file by its ID' })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.fileStorageService.remove(id)
   }
}
