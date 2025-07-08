import {
   ArgumentMetadata,
   BadRequestException,
   Injectable,
   PipeTransform
} from '@nestjs/common'
import { unlink } from 'fs/promises'
import { join } from 'path'

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
   /**
    * File size validation pipe
    * @param size File size in megabytes
    */
   constructor(private size: number = 5) {}

   async transform(file: any, metadata: ArgumentMetadata) {
      if (!file) {
         return null
      }

      const valuePath = join(process.cwd(), file.path)

      const maxLength = this.size * 1000 * 1000
      if (file.size > maxLength) {
         await unlink(valuePath).catch(() => {})

         throw new BadRequestException('File size too large.')
      }

      return { file, extension: file.mimetype.split('/')[1] }
   }
}
