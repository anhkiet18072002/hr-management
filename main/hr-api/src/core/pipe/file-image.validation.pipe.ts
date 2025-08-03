import {
   ArgumentMetadata,
   BadRequestException,
   Injectable,
   PipeTransform
} from '@nestjs/common'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { readBytes } from 'src/util/file.util'

@Injectable()
export class FileImageValidationPipe implements PipeTransform {
   async transform(file: any, metadata: ArgumentMetadata) {
      if (!file) {
         return null
      }

      const valuePath = join(process.cwd(), file.path)

      const isValid = await this.isValid(valuePath)
      if (!isValid) {
         await unlink(valuePath).catch(() => {})

         throw new BadRequestException('Invalid image file.')
      }

      return { file, extension: file.mimetype.split('/')[1] }
   }

   private isValid = async (filePath: string) => {
      const magicNumbers = await readBytes(filePath, 8)

      const imageSignatures: { [key: string]: number[][] } = {
         png: [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]], // PNG
         jpg: [[0xff, 0xd8, 0xff]], // JPG/JPEG
         gif: [[0x47, 0x49, 0x46, 0x38]], // GIF
         bmp: [[0x42, 0x4d]], // BMP
         webp: [[0x52, 0x49, 0x46, 0x46]] // WebP
      }

      for (const [fileType, patterns] of Object.entries(imageSignatures)) {
         if (
            patterns.some((pattern) =>
               magicNumbers
                  .subarray(0, pattern.length)
                  .equals(Buffer.from(pattern))
            )
         ) {
            return fileType
         }
      }

      return null
   }
}
