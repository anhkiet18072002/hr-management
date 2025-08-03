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
export class FileExcelValidationPipe implements PipeTransform {
   async transform(file: any, metadata: ArgumentMetadata) {
      if (!file) {
         return null
      }

      const valuePath = join(process.cwd(), file.path)

      const isValid = await this.isValid(valuePath)
      if (!isValid) {
         await unlink(valuePath).catch(() => {})

         throw new BadRequestException('Invalid excel file.')
      }

      return { file, extension: file.mimetype.split('/')[1] }
   }

   private isValid = async (path: string) => {
      const magicNumbers = await readBytes(path, 8)

      const excelSignatures: { [key: string]: number[][] } = {
         xls: [[208, 207, 17, 224, 161, 177, 26, 225]], // .xls (Excel 97-2003)
         xlsx: [[80, 75, 3, 4, 20, 0, 6, 0]] // .xlsx (Excel 2007+)
      }

      for (const [fileType, patterns] of Object.entries(excelSignatures)) {
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
