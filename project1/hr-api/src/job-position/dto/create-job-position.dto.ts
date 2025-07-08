import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateJobPositionDto {
   @ApiProperty({
      description: 'Name of the job position',
      required: true
   })
   @IsString()
   @IsNotEmpty()
   name: string

   @ApiProperty({
      description: 'Short name of the job position',
      required: false
   })
   @IsString()
   @IsOptional()
   shortName?: string

   @ApiProperty({
      description: 'Description of the job position',
      required: false
   })
   @IsString()
   @IsOptional()
   description?: string

   @ApiProperty({
      description: 'Specification of the job position',
      required: false
   })
   @IsString()
   @IsOptional()
   specification?: string
}
