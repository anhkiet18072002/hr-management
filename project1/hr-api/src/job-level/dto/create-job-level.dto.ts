import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'
import { CreateBaseDto } from 'src/core/dto/create-base.dto'

export class CreateJobLevelDto extends CreateBaseDto {
   @ApiProperty({ description: 'Name of the job level', required: true })
   @IsString()
   @IsNotEmpty()
   name: string

   @ApiProperty({
      description: 'Description for the job level',
      required: false
   })
   @IsOptional()
   @IsString()
   description?: string
}
