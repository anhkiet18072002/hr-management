import { ApiProperty } from '@nestjs/swagger'
import {
   IsNotEmpty,
   IsNumberString,
   IsOptional,
   IsString
} from 'class-validator'

export class UploadFileStorageDto {
   @ApiProperty({
      description: 'Context of file',
      required: true
   })
   @IsString()
   @IsNotEmpty()
   context: string

   @ApiProperty({
      description: 'Extension of file',
      required: false
   })
   @IsString()
   @IsOptional()
   extension?: string

   @ApiProperty({
      description: 'Name of file',
      required: true
   })
   @IsString()
   @IsNotEmpty()
   name: string

   @ApiProperty({
      description: 'Path of file',
      required: false
   })
   @IsString()
   @IsNotEmpty()
   path?: string

   @ApiProperty({
      description: 'Size of file',
      required: true
   })
   @IsNumberString()
   @IsOptional()
   size?: number
}
