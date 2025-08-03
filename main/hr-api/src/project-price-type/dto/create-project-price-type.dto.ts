import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CreateBaseDto } from 'src/core/dto/create-base.dto'

export class CreateProjectPriceTypeDto extends CreateBaseDto {
   @ApiProperty({
      description: 'Name of the project price type',
      required: true
   })
   @IsString()
   @IsNotEmpty()
   name: string

   @ApiProperty({
      description: 'Description of the project price type',
      required: false
   })
   @IsString()
   @IsOptional()
   description?: string
}
