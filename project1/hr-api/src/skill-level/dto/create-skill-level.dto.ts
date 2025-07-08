import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CreateBaseDto } from 'src/core/dto/create-base.dto'

export class CreateSkillLevelDto extends CreateBaseDto {
   @ApiProperty({ description: 'Name of the skill level', required: true })
   @IsString()
   @IsNotEmpty()
   name: string

   @ApiProperty({ description: 'Ordinal of the skill', required: true })
   @IsString()
   @IsNotEmpty()
   ordinal: string

   @ApiProperty({
      description: 'Description of the skill level',
      required: false
   })
   @IsString()
   @IsOptional()
   description?: string
}
