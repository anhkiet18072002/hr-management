import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { BaseService } from 'src/core/base.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { UploadFileStorageDto } from './dto/upload-file-storage.dto'

@Injectable()
export class FileStorageService extends BaseService {
   defaultSelect: Prisma.FileSelect = {
      id: true,
      path: true,
      size: true,
      extension: true,
      name: true,
      context: true
   }
   defaultSearchFields?: string[] = ['path', 'extension', 'name', 'context']

   constructor(readonly prisma: PrismaService) {
      super(prisma.file)
   }

   async upload(dto: UploadFileStorageDto): Promise<File> {
      return await super.create({
         ...dto
      })
   }
}
