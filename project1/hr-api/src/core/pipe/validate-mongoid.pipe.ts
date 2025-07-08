import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { isMongoId } from 'class-validator'

@Injectable()
export class ValidateMongoIdPipe implements PipeTransform<any, string> {
   transform(value: any): string {
      const isValid: boolean = isMongoId(value)
      if (!isValid) {
         throw new BadRequestException('Invalid MongoId')
      }

      return value
   }
}
